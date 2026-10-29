#!/usr/bin/env python3
"""Static checks for the LotusScript sources, for compile errors the Domino importer reports
as warnings (the code only compiles on Domino, so catch the known classes of error early):

  1. FORALL alias variable previously declared  (importer id 7118): a ForAll loop variable
     must NOT also be declared with Dim / as a parameter / as a class member / Const.
  2. Reserved words used as variable names (e.g. Imp, Name); 'For Each' (VB only, not LotusScript).
  3. File header 'Version' line must equal the VERSION file (every .lss).
  4. Non-ASCII characters.

Usage: lint_lss.py <repo root>      exit 0 = OK, 1 = problems. Python 3 standard library only.
"""
import glob
import os
import re
import sys

RESERVED = {"imp", "eqv", "mod", "name", "error", "date", "time", "end", "type", "list", "me", "new",
            "step", "to", "until", "while", "loop", "then", "else", "elseif", "call", "set", "print",
            "base", "default", "property", "stop", "resume", "option", "left", "right", "mid", "len", "format"}
PROC_RE = re.compile(r"^\s*(?:Public\s+|Private\s+|Static\s+)*(Sub|Function)\s+([A-Za-z_]\w*)\s*(\((.*)\))?", re.I)
CLASS_RE = re.compile(r"^\s*(?:Public\s+|Private\s+)?Class\s+([A-Za-z_]\w*)", re.I)
END_PROC_RE = re.compile(r"^\s*End\s+(Sub|Function)\b", re.I)
END_CLASS_RE = re.compile(r"^\s*End\s+Class\b", re.I)
DIM_RE = re.compile(r"^\s*(?:Dim|Private|Public|Static|Const|Redim(?:\s+Preserve)?)\s+(.*)$", re.I)
FORALL_RE = re.compile(r"^\s*ForAll\s+([A-Za-z_]\w*)\s+In\b", re.I)
HEADER_VER_RE = re.compile(r"^'\s*Version\s*:\s*(\S+)", re.I)


def names_from_decl(text):
    """Variable names in a Dim/member/Const/parameter list: 'a As X, b(0 To 2) As Y, c List As Z'."""
    out = []
    text = re.sub(r"\([^)]*\)", "", text)           # drop array bounds / (args)
    text = re.sub(r"=.*$", "", text)                  # Const x = 1
    for part in text.split(","):
        m = re.match(r"\s*(?:ByVal\s+)?([A-Za-z_]\w*)", part)
        if m and m.group(1).lower() not in ("as", "preserve", "list"):
            out.append(m.group(1))
    return out


def lint(path, version, problems, check_header=True):
    base = os.path.basename(path)
    raw = open(path, "rb").read()
    if any(b > 127 for b in raw):
        problems.append("%s: contains non-ASCII characters" % base)
    lines = raw.decode("utf-8", "replace").replace("\r\n", "\n").split("\n")

    # header version
    found = None if check_header else version
    for ln in lines[:15]:
        m = HEADER_VER_RE.match(ln.strip())
        if m:
            found = m.group(1)
            break
    if found is None:
        problems.append("%s: no header line  ' Version        : %s  in the first 15 lines" % (base, version))
    elif found != version:
        problems.append("%s: header version %s != VERSION %s (run bump_version.sh)" % (base, found, version))

    module_names = set()
    class_names = set()
    in_class = False
    proc_names = None
    proc_start = 0
    foralls = []
    for i, ln in enumerate(lines, 1):
        code = ln.split("'")[0] if "'" in ln and not re.search(r'"[^"]*\'[^"]*"', ln) else ln
        if CLASS_RE.match(code):
            in_class = True
            class_names = set()
            continue
        if END_CLASS_RE.match(code):
            in_class = False
            class_names = set()
            continue
        m = PROC_RE.match(code)
        if m and proc_names is None:
            proc_names = set()
            proc_start = i
            foralls = []
            if m.group(4):
                proc_names.update(names_from_decl(m.group(4)))
            continue
        if END_PROC_RE.match(code) and proc_names is not None:
            for (ln_no, alias) in foralls:
                scope = proc_names | class_names | module_names
                if alias.lower() in {n.lower() for n in scope}:
                    problems.append("%s:%d: ForAll alias '%s' is already declared (remove the Dim / rename it)" % (base, ln_no, alias))
            proc_names = None
            continue
        d = DIM_RE.match(code)
        if d and not re.match(r"^\s*(?:Public|Private)\s+(?:Sub|Function|Class)\b", code, re.I):
            for n in names_from_decl(d.group(1)):
                if n.lower() in RESERVED:
                    problems.append("%s:%d: '%s' is a reserved word, rename the variable" % (base, i, n))
                if proc_names is not None:
                    proc_names.add(n)
                elif in_class:
                    class_names.add(n)
                else:
                    module_names.add(n)
        if re.match(r"^\s*For\s+Each\b", code, re.I):
            problems.append("%s:%d: 'For Each' does not exist in LotusScript (use ForAll or an indexed For loop)" % (base, i))
        f = FORALL_RE.match(code)
        if f and proc_names is not None:
            foralls.append((i, f.group(1)))


def main():
    root = sys.argv[1] if len(sys.argv) > 1 else "."
    version = open(os.path.join(root, "VERSION")).read().strip()
    files = sorted(glob.glob(os.path.join(root, "nsf", "ScriptLibraries", "*.lss")) +
                   glob.glob(os.path.join(root, "nsf", "Agents", "*.lss")))
    problems = []
    for f in files:
        lint(f, version, problems)
    installer = os.path.join(root, "installer", "Agent0_Installer_DXL.lss")
    if os.path.exists(installer):
        lint(installer, version, problems, check_header=False)
        files.append(installer)
    if problems:
        print("LotusScript lint problems (%d):" % len(problems))
        for p in problems:
            print("  - " + p)
        return 1
    print("LotusScript lint OK: %d files, version %s." % (len(files), version))
    return 0


if __name__ == "__main__":
    sys.exit(main())
