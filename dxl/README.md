# DXL Files for Advanced/Automated Deployment

This folder contains DXL (Domino XML Language) files for **programmatic import** into HCL Domino.

## Important Note

**Domino Designer does NOT have a "Import DXL" menu option.** 

DXL files are used for:
- Automated deployment scripts
- LotusScript/Java agent imports
- Command-line tools
- Template creation

**For manual deployment, use the BEGINNER_DEPLOYMENT_GUIDE.md instead.**

## Files Included

| File | Description |
|------|-------------|
| `CustomLoginForm.dxl` | The login form with embedded HTML content |
| `SignInFormMapping.dxl` | The form mapping document |

## How to Use DXL Files

### Option 1: LotusScript Agent (Recommended for Automation)

Create a LotusScript agent to import DXL:

```lotusscript
Sub Initialize
    Dim session As New NotesSession
    Dim db As NotesDatabase
    Dim importer As NotesDXLImporter
    Dim stream As NotesStream
    
    Set db = session.CurrentDatabase
    Set importer = session.CreateDXLImporter()
    Set stream = session.CreateStream()
    
    ' Import the login form
    Call stream.Open("C:\path\to\CustomLoginForm.dxl")
    Call importer.SetInput(stream)
    Call importer.SetOutput(db)
    Call importer.Process()
    Call stream.Close()
    
    Print "Import complete"
End Sub
```

### Option 2: Java Import

```java
import lotus.domino.*;

public class DXLImport {
    public static void main(String[] args) throws Exception {
        Session session = NotesFactory.createSession();
        Database db = session.getDatabase("", "domcfg.nsf");
        DXLImporter importer = session.createDXLImporter();
        
        // Import from file
        Stream stream = session.createStream();
        stream.open("CustomLoginForm.dxl");
        importer.setInput(stream);
        importer.setOutput(db);
        importer.process();
    }
}
```

### Option 3: Command Line (If Available)

Some Domino installations include command-line utilities:

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
