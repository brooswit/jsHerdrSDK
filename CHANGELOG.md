# Changelog

All notable changes to `@brooswit/herdr-sdk`. Format is [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
entries are `## [x.y.z] - YYYY-MM-DD` with subsections from: `BREAKING`, `Added`, `Changed`, `Fixed`, `Removed`.
CI (`scripts/release/check.ts`) refuses a merge that changes `src/`, `schema/` or `package.json` without a new entry here.

## Versioning — what the numbers mean in this project

- **MAJOR** — a major restructuring or rewrite that breaks a lot of things, requiring reimplementation by consumers. Requires a `### BREAKING` section.
- **MINOR** — a new feature, or a change to an existing feature that breaks just that feature. Also the floor whenever `schema/herdr-api.schema.json` changes.
- **PATCH** — a fix or correction that requires no consumer code changes, or very minor ones.

## [0.1.1] - 2026-08-24
### Changed
- First release published by CI: npm provenance via trusted publishing, git tag and GitHub Release created automatically on merge to main.

## [0.1.0] - 2026-08-24
### Added
- Typed client for every herdr socket method (91 methods, protocol 20), generated from herdr's published schema.
- Subscriptions as an async iterator; typed `HerdrError` / `HerdrTransportError`; `isTimeout`.
- CI parity check against the latest herdr release.
