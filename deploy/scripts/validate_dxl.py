#!/usr/bin/env python3
"""Structural check of deploy/dxl/Forms/*.form and deploy/dxl/Views/*.view against the Domino DXL DTD subset
this project uses (content models from HCL Domino Designer 14.0 "Domino DTD" reference).

It catches the errors the NotesDXLImporter rejects, before you import:
  - <run> may hold plain text and <font> only (NOT <text>)
  - <par> holds <run>/<field>; <field> holds <code>; <code> holds <formula>
  - <view> holds <code>* then <column>*; <column> holds <code>*
  - no whitespace-only text between elements inside par/field/code/column
  - attribute names/values limited to the ones proven to import

Usage: validate_dxl.py deploy/dxl     exit code 0 = OK, 1 = problems
Python 3 standard library only.
"""
import sys
import glob
import os
import xml.etree.ElementTree as ET

NS = "{http://www.lotus.com/dxl}"
FIELD_KINDS = {"editable", "computed", "computedfordisplay", "computedwhencomposed"}
FIELD_TYPES = {"text", "number", "datetime", "names", "keyword", "richtext", "readers"}
CODE_EVENTS = {"defaultvalue", "inputvalidation", "value", "selection"}
ATTRS = {
    "form": {"name", "version", "xmlns"},
    "view": {"name", "version", "xmlns"},
    "pardef": {"id"},
    "par": {"def"},
    "field": {"name", "type", "kind"},
    "code": {"event"},
    "column": {"itemname", "sort", "sortnocase", "width"},
}
SORTS = {"ascending", "descending"}
BOOLS = {"true", "false"}

problems = []


def err(path, el, msg):
    problems.append("%s: <%s>: %s" % (os.path.basename(path), el.tag.replace(NS, ""), msg))


def tag(el):
    return el.tag.replace(NS, "")


def check_attrs(path, el):
    allowed = ATTRS.get(tag(el))
    if allowed is None:
        return
    for a in el.attrib:
        if a.replace(NS, "") not in allowed:
            err(path, el, "attribute '%s' is not allowed (allowed: %s)" % (a, ", ".join(sorted(allowed))))


def no_stray_text(path, el, mixed=False):
    """Elements-only content must not carry text; indentation between tags is the usual culprit."""
    if not mixed and el.text and el.text.strip() == "" and len(el) > 0 and el.text != "":
        err(path, el, "whitespace between the start tag and its first child (remove indentation/newlines)")
    for child in el:
        if child.tail and child.tail.strip() == "" and child.tail != "" and tag(el) in ("par", "field", "code", "column"):
            err(path, el, "whitespace between child elements (remove indentation/newlines)")
        if child.tail and child.tail.strip() != "":
            err(path, el, "unexpected text '%s' between elements" % child.tail.strip()[:30])
    if el.text and el.text.strip() != "" and tag(el) in ("form", "view", "body", "richtext", "par", "field", "code", "column"):
        err(path, el, "unexpected text '%s'" % el.text.strip()[:30])


def check_code(path, code, context):
    check_attrs(path, code)
    ev = code.get("event")
    if ev not in CODE_EVENTS:
        err(path, code, "code event '%s' not in the proven set %s" % (ev, sorted(CODE_EVENTS)))
    kids = [tag(c) for c in code]
    if kids != ["formula"]:
        err(path, code, "must contain exactly one <formula>, found %s" % kids)
    elif not (code[0].text or "").strip():
        err(path, code, "empty formula")
    no_stray_text(path, code)


def check_field(path, f):
    check_attrs(path, f)
    if not f.get("name"):
        err(path, f, "missing name")
    if f.get("type", "text") not in FIELD_TYPES:
        err(path, f, "unknown type '%s'" % f.get("type"))
    if f.get("kind", "editable") not in FIELD_KINDS:
        err(path, f, "unknown kind '%s'" % f.get("kind"))
    for c in f:
        if tag(c) == "code":
            check_code(path, c, "field")
        else:
            err(path, f, "child <%s> not allowed here (only <code>)" % tag(c))
    no_stray_text(path, f)


def check_form(path, root):
    check_attrs(path, root)
    kids = [tag(c) for c in root]
    if "body" not in kids:
        err(path, root, "missing <body>")
    for c in root:
        t = tag(c)
        if t == "code":
            check_code(path, c, "form")
        elif t == "body":
            rt = [tag(x) for x in c]
            if rt != ["richtext"]:
                err(path, c, "must contain exactly one <richtext>, found %s" % rt)
                continue
            for x in c[0]:
                xt = tag(x)
                if xt == "pardef":
                    check_attrs(path, x)
                    if len(x):
                        err(path, x, "pardef must be empty here")
                elif xt == "par":
                    check_attrs(path, x)
                    for y in x:
                        yt = tag(y)
                        if yt == "run":
                            for z in y:
                                if tag(z) != "font":
                                    err(path, y, "<run> may only contain text and <font>, found <%s>" % tag(z))
                            if not "".join(y.itertext()).strip():
                                err(path, y, "empty run")
                        elif yt == "field":
                            check_field(path, y)
                        else:
                            err(path, x, "child <%s> not allowed (use <run> or <field>)" % yt)
                    no_stray_text(path, x)
                else:
                    err(path, c[0], "child <%s> not allowed in richtext (use pardef/par)" % xt)
            no_stray_text(path, c[0], mixed=True)
        else:
            err(path, root, "child <%s> not allowed (use code, then body)" % t)
    # every par def must reference a declared pardef id
    ids = {p.get("id") for p in root.iter(NS + "pardef")}
    for p in root.iter(NS + "par"):
        if p.get("def") and p.get("def") not in ids:
            err(path, p, "def='%s' has no matching <pardef id>" % p.get("def"))


def check_view(path, root):
    check_attrs(path, root)
    seen_column = False
    sel = 0
    for c in root:
        t = tag(c)
        if t == "code":
            if seen_column:
                err(path, root, "<code> must come before <column>")
            check_code(path, c, "view")
            sel += c.get("event") == "selection"
        elif t == "column":
            seen_column = True
            check_attrs(path, c)
            if not c.get("itemname"):
                err(path, c, "missing itemname")
            if c.get("sort") and c.get("sort") not in SORTS:
                err(path, c, "bad sort '%s'" % c.get("sort"))
            if c.get("sortnocase") and c.get("sortnocase") not in BOOLS:
                err(path, c, "bad sortnocase")
            for x in c:
                if tag(x) == "code":
                    check_code(path, x, "column")
                else:
                    err(path, c, "child <%s> not allowed here (only <code>)" % tag(x))
            no_stray_text(path, c)
        else:
            err(path, root, "child <%s> not allowed (use code*, then column*)" % t)
    if sel != 1:
        err(path, root, "needs exactly one selection formula, found %d" % sel)
    if not seen_column:
        err(path, root, "no columns")


def main():
    base = sys.argv[1] if len(sys.argv) > 1 else "deploy/dxl"
    files = sorted(glob.glob(os.path.join(base, "Forms", "*.form")) + glob.glob(os.path.join(base, "Views", "*.view")))
    if not files:
        print("No DXL files found under %s" % base)
        return 1
    for path in files:
        try:
            root = ET.parse(path).getroot()
        except ET.ParseError as e:
            problems.append("%s: not well-formed XML: %s" % (os.path.basename(path), e))
            continue
        t = tag(root)
        if t == "form":
            check_form(path, root)
        elif t == "view":
            check_view(path, root)
        else:
            problems.append("%s: root must be <form> or <view>, found <%s>" % (os.path.basename(path), t))
    if problems:
        print("DXL structure problems (%d):" % len(problems))
        for p in problems:
            print("  - " + p)
        return 1
    print("DXL structure OK: %d files." % len(files))
    return 0


if __name__ == "__main__":
    sys.exit(main())
