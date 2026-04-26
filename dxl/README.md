# DXL Import Files

This folder contains DXL (Domino XML Language) files for easy import into HCL Domino.

## Files Included

| File | Description |
|------|-------------|
| `CustomLoginForm.dxl` | The main login form with all HTML, CSS references, and JavaScript |
| `SignInFormMapping.dxl` | The mapping document that tells Domino to use the custom form |

## Import Instructions

### Prerequisites

1. **DOMCFG.NSF must exist** - Create it first if it doesn't
2. **You need Designer access** to DOMCFG.NSF
3. **HCL Domino Designer** must be installed

### Step-by-Step Import

#### Step 1: Import the Login Form

1. Open **HCL Domino Designer**
2. Open `domcfg.nsf` database on your server
3. Click **File** → **Import** → **DXL**
4. Browse to and select `CustomLoginForm.dxl`
5. Click **Import**
6. Verify: Expand **Forms** in the design pane - you should see `CustomLoginForm`

#### Step 2: Import the Mapping Document

1. With DOMCFG.NSF still open in Designer
2. Click **File** → **Import** → **DXL**
3. Browse to and select `SignInFormMapping.dxl`
4. Click **Import**
5. Verify: The mapping document should now exist

#### Step 3: Import Resource Files

The form references these files which must be imported separately:

1. In Designer, expand **Resources** → **Files**
2. Right-click → **Import**
3. Import each file:

| Source File | Target Name |
|-------------|-------------|
| `../css/login.css` | `login.css` |
| `../config.js` | `config.js` |
| `../js/login.js` | `login.js` |
| `../i18n/translations.js` | `translations.js` |
| `../images/logo-placeholder.svg` | `logo.svg` |

**Note:** File resources don't need paths - Domino serves them from the database root.

#### Step 4: Restart HTTP

On Domino console:
```
tell http restart
```

#### Step 5: Test

1. Open incognito/private browser window
2. Navigate to: `https://your-server.com/names.nsf`
3. You should see the custom login form

## Alternative: Command Line DXL Import

If you have access to the Domino server console or command line, you can use the DXL import utility:

### On Windows (Domino server)

```batch
@echo off
cd "C:\Program Files\HCL\Domino"

rem Import Login Form
java -jar dxlutil.jar import -f "path\to\CustomLoginForm.dxl" -d "domcfg.nsf"

rem Import Mapping
java -jar dxlutil.jar import -f "path\to\SignInFormMapping.dxl" -d "domcfg.nsf"
```

### On Linux (Domino server)

```bash
#!/bin/bash
cd /opt/hcl/domino/bin

# Import Login Form
./dxlutil import -f "/path/to/CustomLoginForm.dxl" -d "domcfg.nsf"

# Import Mapping
./dxlutil import -f "/path/to/SignInFormMapping.dxl" -d "domcfg.nsf"
```

**Note:** The `dxlutil` command may not be available in all Domino installations. Use Domino Designer for the most reliable import.

## Troubleshooting Import Issues

### "No DXL import option available"

- Ensure you're in **Domino Designer** (not Notes Client)
- Ensure the database is **open and selected**
- Try: **Tools** → **Import DXL** as alternative menu location

### "Import failed - XML parsing error"

- Ensure the DXL file wasn't corrupted during transfer
- Open in text editor and verify XML structure is intact
- Check for encoding issues (should be UTF-8)

### "Form already exists"

- The form with that name already exists
- Either delete the existing form first, or
- Rename the existing form before import

### "Cannot access database"

- Check your ACL access level (need Designer or higher)
- Verify the database path is correct
- Ensure you're connected to the correct server

## What Gets Imported

### CustomLoginForm.dxl creates:

- Form named `CustomLoginForm`
- Pass-Thru HTML content
- References to external resources:
  - `/domcfg.nsf/config.js`
  - `/domcfg.nsf/login.css`
  - `/domcfg.nsf/login.js`
  - `/domcfg.nsf/translations.js`
  - `/domcfg.nsf/logo.svg`

### SignInFormMapping.dxl creates:

- Document of type `LoginFormMapping`
- Configured for "All Web Sites / Entire Server"
- Points to `CustomLoginForm` in `domcfg.nsf`

## After Import Customization

Once imported, customize by editing `config.js`:

1. Open DOMCFG.NSF in Designer
2. Expand **Resources** → **Files**
3. Double-click `config.js`
4. Edit settings (see main documentation)
5. Save (Ctrl+S)
6. Restart HTTP service

---

*For detailed instructions, see the BEGINNER_DEPLOYMENT_GUIDE.md*
