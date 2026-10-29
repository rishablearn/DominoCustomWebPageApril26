#!/usr/bin/env bash
#
# github-sync.sh — two-way sync (pull + push) between this repo and GitHub.
# Compatible with macOS default bash 3.2 / BSD userland.
#
# Usage:
#   ./github-sync.sh [command] [options]
#
# Commands:
#   sync    (default) fetch -> commit local changes -> rebase onto remote -> push
#   pull    fetch and rebase onto remote (local changes are auto-stashed)
#   push    commit local changes and push (refuses if remote has new commits)
#   status  fetch and show ahead/behind + pending changes (read-only)
#
# Options:
#   -m MSG       commit message (default: "Sync <timestamp>")
#   -n           dry run: fetch + report only, change nothing
#   -y           assume "yes" to prompts
#   --no-scan    skip the secret scan (still asks for confirmation)
#
# Stale locks: detects leftover .git/*.lock files (e.g. index.lock) and removes
# them after confirmation, only when no git process is running.
# Safety: never force-pushes, never resets/discards work, lists deletions
# before committing, scans only ADDED lines for high-confidence secrets.
# Auth: uses your existing git credential helper / SSH key. No tokens handled.

set -euo pipefail

CMD="sync"
MSG=""
DRY_RUN=0
ASSUME_YES=0
SCAN=1

# --- Args --------------------------------------------------------------------
if [[ $# -gt 0 && "$1" != -* ]]; then CMD="$1"; shift; fi
while [[ $# -gt 0 ]]; do
  case "$1" in
    -m) [[ $# -ge 2 ]] || { echo "-m needs a value" >&2; exit 2; }; MSG="$2"; shift 2 ;;
    -n) DRY_RUN=1; shift ;;
    -y) ASSUME_YES=1; shift ;;
    --no-scan) SCAN=0; shift ;;
    -h|--help) sed -n '2,26p' "$0"; exit 0 ;;
    *) echo "Unknown option: $1 (try --help)" >&2; exit 2 ;;
  esac
done
case "$CMD" in sync|pull|push|status) ;; *) echo "Unknown command: $CMD" >&2; exit 2 ;; esac

# --- Helpers -----------------------------------------------------------------
die()  { echo "ERROR: $*" >&2; exit 1; }
info() { echo "==> $*"; }
warn() { echo "WARNING: $*" >&2; }
run()  { if [[ $DRY_RUN -eq 1 ]]; then echo "[dry-run] $*"; else "$@"; fi; }

confirm() {  # confirm "question"
  [[ $ASSUME_YES -eq 1 || $DRY_RUN -eq 1 ]] && return 0
  local ans; read -r -p "$1 [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]]
}

retry() {  # retry <cmd...>  — 3 attempts, exponential backoff (network flakiness)
  local n=1 d=3
  until "$@"; do
    [[ $n -ge 3 ]] && return 1
    info "Failed (attempt $n/3). Retrying in ${d}s..."
    sleep "$d"; n=$((n+1)); d=$((d*2))
  done
}

clear_stale_locks() {  # remove leftover *.lock files from crashed/interrupted git runs
  local gd locks f ts
  gd="$(git rev-parse --absolute-git-dir)"
  locks="$(find "$gd" -name '*.lock' -type f 2>/dev/null || true)"
  [[ -n "$locks" ]] || return 0

  warn "Git lock file(s) found:"
  while IFS= read -r f; do
    if [[ "$(uname)" == "Darwin" ]]; then ts="$(stat -f '%Sm' "$f")"; else ts="$(stat -c '%y' "$f")"; fi
    echo "    $f  (modified: $ts)" >&2
  done <<< "$locks"

  # A lock is only stale if no git process is using the repo (IDE/GUI clients also run git).
  if pgrep -x git >/dev/null 2>&1; then
    die "A git process is currently running. Wait for it to finish (or close IDE/GUI git clients) and re-run."
  fi

  if [[ $DRY_RUN -eq 1 ]]; then
    info "[dry-run] would remove the lock file(s) above."
    return 0
  fi
  confirm "No git process is running; remove the stale lock file(s)?" || die "Cancelled (locks left in place)."
  while IFS= read -r f; do
    rm -f "$f" || die "Could not remove $f (check file permissions/ownership)."
  done <<< "$locks"
  info "Removed stale lock file(s)."
}

# --- Preconditions -----------------------------------------------------------
command -v git >/dev/null || die "git not found. Install: xcode-select --install"
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel 2>/dev/null)" \
  || die "Not inside a git repository."
git remote get-url origin >/dev/null 2>&1 || die "No 'origin' remote configured."

clear_stale_locks

BRANCH="$(git branch --show-current)"
[[ -n "$BRANCH" ]] || die "Detached HEAD; check out a branch first."

GIT_DIR="$(git rev-parse --git-dir)"
for f in MERGE_HEAD rebase-merge rebase-apply CHERRY_PICK_HEAD; do
  [[ ! -e "$GIT_DIR/$f" ]] || die "Repo is mid-operation ($f). Finish it ('git rebase --continue' / '--abort') first."
done
[[ -z "$(git diff --name-only --diff-filter=U)" ]] || die "Unresolved merge conflicts exist. Resolve them first."

info "Repo:   $(git remote get-url origin)"
info "Branch: $BRANCH   Command: $CMD$([[ $DRY_RUN -eq 1 ]] && echo ' (dry run)')"

# --- Secret scan (added lines only; high-confidence patterns) ----------------
SUSPECT_NAMES='(^|/)(\.env(\..*)?|.*\.(pem|key|p12|pfx|jks|keystore)|id_(rsa|ed25519)|credentials(\.json)?)$'
HIGH='AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----'
# quoted literal (>=12 chars, no spaces) assigned to a secret-like name AND containing a digit
ASSIGN='(password|passwd|pwd|secret|api[_-]?key|token|auth)[A-Za-z_]*[[:space:]]*[=:][[:space:]]*["'"'"'][^"'"'"' ]{12,}["'"'"']'
HASDIGIT='["'"'"'][A-Za-z0-9/+_=.-]*[0-9][A-Za-z0-9/+_=.-]*["'"'"']'
PLACEHOLDER='<[A-Za-z_ -]+>|\$\{|%[A-Za-z_]+%|changeme|example|placeholder|your[_-]|xxxx|\*\*\*'

added_lines() {  # emits "file:content" for every added/new line
  if git rev-parse -q --verify HEAD >/dev/null; then
    git diff HEAD -U0 --no-color --diff-filter=AM | awk '
      /^\+\+\+ b\//{f=substr($0,7);next}
      /^\+\+\+ /{next}
      /^\+/{print f":"substr($0,2)}'
  fi
  git ls-files --others --exclude-standard -z | while IFS= read -r -d '' f; do
    [[ -f "$f" ]] && grep -I '' "$f" 2>/dev/null | awk -v f="$f" '{print f":"$0}'
  done
}

secret_scan() {  # returns 0 if clean
  local hits="" names=""
  # existing, non-template files only (deleted files and *.example/.sample/.template are fine)
  names="$(git ls-files --modified --others --exclude-standard \
           | while IFS= read -r f; do [[ -f "$f" ]] && echo "$f"; done \
           | grep -E "$SUSPECT_NAMES" | grep -Evi '\.(example|sample|template)$' || true)"
  hits="$( { added_lines | grep -E "$HIGH" || true
             added_lines | grep -Ei "$ASSIGN" | grep -E "$HASDIGIT" || true; } \
           | grep -Evi "$PLACEHOLDER" | sort -u | cut -c1-160 || true)"
  if [[ -n "$names" || -n "$hits" ]]; then
    warn "Possible secrets in changes you are about to commit:"
    [[ -n "$names" ]] && { echo "  Sensitive filenames:" >&2; echo "$names" | sed 's/^/    /' >&2; }
    [[ -n "$hits"  ]] && { echo "  Suspicious lines (file:line-text, truncated):" >&2; echo "$hits" | sed 's/^/    /' >&2; }
    echo "  Replace with placeholders / add to .gitignore. If a real secret was exposed, rotate it." >&2
    return 1
  fi
  return 0
}

# --- Fetch & state -----------------------------------------------------------
info "Fetching origin..."
retry git fetch --prune origin || die "Fetch failed. Check network/auth (SSH key or credential helper)."

UP="origin/$BRANCH"
HAS_REMOTE=0
git rev-parse -q --verify "refs/remotes/$UP" >/dev/null && HAS_REMOTE=1

AHEAD=0; BEHIND=0
update_counts() {
  if [[ $HAS_REMOTE -eq 1 ]]; then
    set -- $(git rev-list --left-right --count "HEAD...$UP")
    AHEAD=$1; BEHIND=$2
  else
    AHEAD=$(git rev-list --count HEAD); BEHIND=0
  fi
}
update_counts
DIRTY=0; [[ -n "$(git status --porcelain)" ]] && DIRTY=1

if [[ $HAS_REMOTE -eq 1 ]]; then
  info "Remote: $AHEAD ahead (to push), $BEHIND behind (to pull)"
else
  info "Remote branch '$BRANCH' does not exist yet; push will create it."
fi
if [[ $BEHIND -gt 0 ]]; then
  info "Incoming commits:"; git log --oneline --no-decorate HEAD.."$UP" | sed 's/^/    /'
fi
if [[ $AHEAD -gt 0 && $HAS_REMOTE -eq 1 ]]; then
  info "Outgoing commits:"; git log --oneline --no-decorate "$UP"..HEAD | sed 's/^/    /'
fi
if [[ $DIRTY -eq 1 ]]; then
  info "Local changes:"; git status --short | sed 's/^/    /'
fi

[[ "$CMD" == "status" ]] && exit 0

# --- Nested repositories ------------------------------------------------------
# A folder with its own .git (e.g. a reference project copied in for comparison) is staged by
# 'git add -A' as a bare submodule pointer (mode 160000): no files, no .gitmodules, broken on
# GitHub. Never commit one by accident: unstage new ones and tell the user how to ignore them.
unstage_nested_repos() {
  [[ $DRY_RUN -eq 1 ]] && return 0
  local line path found=0
  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    path="${line#*	}"
    # only gitlinks that are NEW in this commit (an existing one is the user's decision)
    if ! git cat-file -e "HEAD:$path" 2>/dev/null; then
      git rm --cached -f -q -r -- "$path" || true
      warn "Not committed: '$path' is a separate git repository (it has its own .git)."
      echo "    Add it to .gitignore:   echo '$path/' >> .gitignore   (then re-run)" >&2
      found=1
    fi
  done < <(git ls-files -s | awk '$1 == "160000"')
  if [[ $found -eq 0 && -z "$(git status --porcelain | head -1)" ]]; then return 0; fi
  # Tracked gitlinks without .gitmodules are broken on GitHub: report them.
  if [[ ! -f .gitmodules ]]; then
    git ls-files -s | awk '$1 == "160000" {print $4}' | while IFS= read -r path; do
      warn "'$path' is tracked as an embedded repo without .gitmodules (shows as an empty folder on GitHub). Fix: git rm --cached '$path' && echo '$path/' >> .gitignore"
    done
  fi
}

# --- Commit local changes (sync/push) ----------------------------------------
commit_local() {
  [[ $DIRTY -eq 1 ]] || return 0

  local dels; dels="$(git status --porcelain | grep -E '^( D|D |AD)' || true)"
  if [[ -n "$dels" ]]; then
    warn "These files will be DELETED in the commit (and from GitHub):"
    echo "$dels" | sed 's/^/    /' >&2
  fi

  if [[ $SCAN -eq 1 ]]; then
    if ! secret_scan; then
      [[ $DRY_RUN -eq 1 ]] && { info "[dry-run] would stop here until flagged items are fixed."; return 0; }
      confirm "Flagged items above may be false positives. Commit anyway?" || die "Aborted; fix flagged items and re-run (or use --no-scan after review)."
    fi
  else
    warn "Secret scan skipped (--no-scan)."
  fi

  confirm "Commit all local changes?" || die "Cancelled."
  run git add -A
  unstage_nested_repos
  run git commit -m "${MSG:-Sync $(date '+%Y-%m-%d %H:%M:%S')}"
}

# --- Rebase onto remote ------------------------------------------------------
rebase_remote() {
  [[ $HAS_REMOTE -eq 1 ]] || return 0
  update_counts
  [[ $BEHIND -gt 0 ]] || return 0
  info "Rebasing local work onto $UP..."
  if ! run git pull --rebase --autostash origin "$BRANCH"; then
    echo >&2
    warn "Rebase hit conflicts in:"
    git diff --name-only --diff-filter=U | sed 's/^/    /' >&2
    echo "  Fix the files, then: git add <files> && git rebase --continue" >&2
    echo "  To back out safely:  git rebase --abort   (your commits are preserved)" >&2
    exit 1
  fi
  [[ $DRY_RUN -eq 1 ]] || { info "Pulled changes:"; git diff --stat ORIG_HEAD HEAD 2>/dev/null | tail -n 15 | sed 's/^/    /' || true; }
}

# --- Push (never forced) -----------------------------------------------------
push_remote() {
  [[ $DRY_RUN -eq 1 ]] && { info "[dry-run] would push $BRANCH to origin"; return 0; }
  local n=1
  update_counts
  if [[ $HAS_REMOTE -eq 1 && $AHEAD -eq 0 ]]; then info "Nothing to push."; return 0; fi
  until git push -u --follow-tags origin "$BRANCH"; do
    [[ $n -ge 3 ]] && die "Push failed after 3 attempts (auth, branch protection, or repeated remote updates)."
    info "Push rejected/failed (attempt $n/3). Re-fetching and rebasing..."
    retry git fetch --prune origin
    HAS_REMOTE=1
    rebase_remote
    n=$((n+1))
  done
}

case "$CMD" in
  sync)
    commit_local
    rebase_remote
    push_remote
    ;;
  pull)
    rebase_remote
    ;;
  push)
    [[ $BEHIND -eq 0 ]] || die "Remote is $BEHIND commit(s) ahead. Run './github-sync.sh sync' or 'pull' first."
    commit_local
    push_remote
    ;;
esac

# --- Summary -----------------------------------------------------------------
if [[ $DRY_RUN -eq 0 ]]; then
  git fetch -q origin 2>/dev/null || true
  git rev-parse -q --verify "refs/remotes/$UP" >/dev/null && { HAS_REMOTE=1; update_counts; }
  info "Done. HEAD: $(git log -1 --pretty='%h %s')"
  info "Status vs $UP: $AHEAD ahead, $BEHIND behind"
fi
