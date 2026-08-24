# Changelog

All notable changes to `@brooswit/herdr-sdk`. Format is [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
entries are `## [x.y.z] - YYYY-MM-DD` with subsections from: `BREAKING`, `Added`, `Changed`, `Fixed`, `Removed`.
CI (`scripts/release/check.ts`) refuses a merge that changes `src/`, `schema/` or `package.json` without a new entry here.

## Versioning — what the numbers mean in this project

- **MAJOR** — a major restructuring or rewrite that breaks a lot of things, requiring reimplementation by consumers. Requires a `### BREAKING` section.
- **MINOR** — a new feature, or a change to an existing feature that breaks just that feature. Also the floor whenever `schema/herdr-api.schema.json` changes.
- **PATCH** — a fix or correction that requires no consumer code changes, or very minor ones.

## [0.1.2] - 2026-08-24
### Fixed
- `package.json` now declares `repository`. npm provenance verification requires it to match the building repo; without it the registry refused 0.1.1 with E422, so 0.1.1 was never published and this is the first CI-published release.

## [0.1.1] - 2026-08-24
_Never published: the CI publish was refused by provenance verification (see 0.1.2)._
### Added
- In-process fake herdr for tests; the socket layer and every service wrapper are now covered without a running herdr. CI blocks merges under 90% line and function coverage.
### Added
- Every source file has a generated load test, and a meta-test that every file has one — a file no test imports is invisible to coverage and could ship unparseable.
- In-process fake herdr; the socket layer and all 91 service wrappers are tested without a running herdr. The code generator is tested and proven byte-identical to its committed output.
- CI blocks merges under 90% whole-project line and function coverage.
### Changed
- First release published by CI: npm provenance via trusted publishing, git tag and GitHub Release created automatically on merge to main.

## [0.1.0] - 2026-08-24
### Added
- Typed client for every herdr socket method (91 methods, protocol 20), generated from herdr's published schema.
- Subscriptions as an async iterator; typed `HerdrError` / `HerdrTransportError`; `isTimeout`.
- CI parity check against the latest herdr release.
