#!/usr/bin/env python3
"""Build Deployment.html from Deployment.md (single self-contained file, light/dark, no external requests).

Usage: python3 tools/build_docs.py          (needs:  pip install markdown)
Deployment.md is the source of truth; never edit Deployment.html by hand.
"""
import html
import os
import re
import sys

try:
    import markdown
except ImportError:
    sys.exit("Missing module: pip install markdown")

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
src = open(os.path.join(ROOT, "Deployment.md"), encoding="utf-8").read()
version = open(os.path.join(ROOT, "VERSION")).read().strip()

# The hand-written "Contents" list is replaced by a generated, linked navigation.
src = re.sub(r"## Contents\n.*?\n---\n", "", src, count=1, flags=re.S)

md = markdown.Markdown(extensions=["tables", "fenced_code", "toc", "sane_lists"],
                       extension_configs={"toc": {"toc_depth": "2"}})
body = md.convert(src)
title = re.search(r"^# (.+)$", src, re.M).group(1)

nav = []
for tok in md.toc_tokens:
    for h in tok.get("children", []):
        nav.append('<a href="#%s">%s</a>' % (h["id"], html.escape(h["name"])))

page = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>%(title)s</title>
<style>
:root{--bg:#fff;--fg:#1d2430;--mut:#5b6677;--line:#d9dee7;--code:#f3f5f9;--acc:#0b5cab;--nav:#f7f9fc}
@media (prefers-color-scheme:dark){:root{--bg:#10151c;--fg:#e4e9f0;--mut:#9aa6b8;--line:#2a3340;--code:#1a222d;--acc:#6db2ff;--nav:#151c26}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.wrap{display:flex;max-width:1280px;margin:0 auto}
nav{position:sticky;top:0;align-self:flex-start;width:260px;flex:none;height:100vh;overflow:auto;padding:24px 16px;background:var(--nav);border-right:1px solid var(--line)}
nav b{display:block;margin-bottom:8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:var(--mut)}
nav a{display:block;padding:4px 8px;border-radius:6px;color:var(--fg);text-decoration:none;font-size:14px}nav a:hover{background:var(--code);color:var(--acc)}
main{min-width:0;flex:1;padding:32px 40px 80px;max-width:960px}
h1{font-size:28px;margin-top:0}h2{font-size:22px;margin-top:2.2em;padding-top:.6em;border-top:1px solid var(--line)}h3{font-size:18px;margin-top:1.6em}
a{color:var(--acc)}code{background:var(--code);padding:.1em .35em;border-radius:4px;font:13.5px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
pre{background:var(--code);padding:14px 16px;border-radius:8px;overflow:auto}pre code{background:none;padding:0}
table{border-collapse:collapse;display:block;overflow-x:auto;margin:1em 0}th,td{border:1px solid var(--line);padding:6px 10px;text-align:left;vertical-align:top}th{background:var(--code)}
blockquote{margin:1em 0;padding:.4em 1em;border-left:4px solid var(--acc);background:var(--code);color:var(--mut)}hr{border:0;border-top:1px solid var(--line)}
@media (max-width:860px){.wrap{display:block}nav{position:static;width:auto;height:auto;border-right:0;border-bottom:1px solid var(--line)}main{padding:20px 16px 60px}}
@media print{nav{display:none}main{max-width:none;padding:0}}
</style></head><body><div class="wrap">
<nav><b>v%(version)s</b>%(nav)s</nav>
<main>
%(body)s
<hr><p style="color:var(--mut);font-size:13px">Generated from Deployment.md by tools/build_docs.py. Edit the .md, not this file.</p>
</main></div></body></html>
""" % {"title": html.escape(title), "version": html.escape(version), "nav": "".join(nav), "body": body}

out = os.path.join(ROOT, "Deployment.html")
open(out, "w", encoding="utf-8").write(page)
print("wrote %s (%d bytes)" % (out, len(page)))
