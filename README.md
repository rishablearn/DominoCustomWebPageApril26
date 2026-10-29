# HCL Domino Custom Login Page + Login Activity (HCL Verse)

**Version:** 3.1.0  
**Last Updated:** 2026-10-29  
**Targets:** HCL Domino 12.0.1+ / 14.x, HCL Verse on-premises 3.2.x (developed against 3.2.7)

A branded login page for HCL Domino (self-contained HTML in `domcfg.nsf`) plus a server-side **login audit**: users see their last 5 successful logins (IP, time, approximate session duration, access source, new-IP / new-device flags) in an HCL Verse "Login Activity" window and can report a sign-in as "This wasn't me". `loginaudit.nsf` is built by a DXL installer.

> Status: written and statically checked, **not yet run on a Domino server**. Follow the test plan in the Deployment guide before production.

## Documentation

**[Deployment.md](Deployment.md)** (also as **[Deployment.html](Deployment.html)**) is the only guide: overview, installer, configuration, login page, Verse, test plan, production notes, troubleshooting. History: [CHANGELOG.md](CHANGELOG.md).

## Layout

```
nsf/          everything that goes into loginaudit.nsf
              MANIFEST.txt, Forms/, Views/ (DXL), ScriptLibraries/, Agents/ (.lss), WebContent/ (viewer page)
installer/    Agent0_Installer_DXL.lss  - run once in a Notes client; builds loginaudit.nsf from nsf/
domcfg/       DominoEmbeddedForm.html   - the login page ($$LoginUserForm in domcfg.nsf)
verse/        applications.json, merge-snippet.json - Verse "Login Activity" menu entry
tools/        bump-version.sh, lint_lss.py, validate_dxl.py, build_docs.py, github-sync.sh
archive/      EVALUATION.md - review that led to this design
```

## Quick start

1. Run the installer (`installer/Agent0_Installer_DXL.lss`) - Deployment.md section 3.
2. Set the constants, recompile and sign, schedule the purge agent - section 4.
3. Import `nsf/WebContent/LoginActivityViewer.html` as a file resource - section 5.
4. Deploy the login page and turn the audit on - section 6.
5. Register the Verse extension - section 7.
6. Run the test plan - section 8; production notes - section 9.

## Maintaining

```bash
python3 tools/lint_lss.py .            # LotusScript checks
python3 tools/validate_dxl.py nsf      # DXL structure checks
bash tools/bump-version.sh X.Y.Z       # version everywhere + rebuilds Deployment.html
python3 tools/build_docs.py            # Deployment.md -> Deployment.html
bash tools/github-sync.sh -m "msg"     # commit, rebase, push
```
