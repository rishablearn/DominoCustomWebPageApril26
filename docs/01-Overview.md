# Project Overview

> **Version:** 3.0.0 | **Compatible:** HCL Domino 12.0.1+ / 14.x, HCL Verse on-prem 3.2.x | **Last Updated:** 2026-10-28

## What this is

1. A custom Domino login page (`login-forms/DominoEmbeddedForm.html`): branding, 18 languages with RTL, dark/light theme, configurable CAPTCHA (math or alphanumeric canvas, with audio), TOTP step for Domino MFA, accessibility (WCAG 2.1 AA). All CSS/JS inline — deploy as one Pass-Thru HTML form in `DOMCFG.NSF`.
2. A **login audit** in a separate database `loginaudit.nsf`, written by agents, shown to the user in HCL Verse.

## Design rules

| Rule | Why |
|---|---|
| Identity comes from the server (`Remote_User`), never from the browser | A client-supplied username can be forged |
| Record only after authentication (landing agent) | Entries are real, successful logins |
| Server time, server-side User-Agent parsing | Client clocks and fields are user-controlled |
| Separate database, one document per login, Readers-protected | No writes to the Domino Directory; user sees only own events |
| Agents run as a least-privilege signer, fail closed on unknown identity | `EffectiveUserName` is the signer in that mode and is never used |
| Open-redirect and CSRF guards, input caps | Landing/NotMe/Heartbeat are reachable by any signed-in user |

## Event fields (`Form = "LoginEvent"`)

`UserCanonical`, `UserCommon`, `LoginTime` (date/time, server), `LoginTimeUTC` (ISO text), `IP`, `RemoteAddr`, `ForwardedFor`, `UserAgent`, `Browser`, `OS`, `DeviceType`, `DeviceKey`, `AccessSource`, `AuthMethod`, `FirstLogin`, `NewIP`, `NewDevice`, `Heartbeats`, `LastSeen`, `EndTime`, `EndReason`, `NotMeFlag`, `NotMeTime`, `ReviewStatus`, `Readers`.

## Where to read next

- [`02-Deployment-Guide.md`](02-Deployment-Guide.md) — build, configure, test (testing + production notes)
- [`03-Verse-Extension.md`](03-Verse-Extension.md) — Login Activity window in Verse
- [`../EVALUATION.md`](../EVALUATION.md) — what was wrong with the previous tracking and why it changed
