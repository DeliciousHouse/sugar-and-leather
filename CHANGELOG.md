# Changelog

All notable changes to this project are documented in this file.

## 1.0.2 - 2026-08-13

### Fixed

- Recover a verified rollback image from the commit served by the live container when Docker can no longer inspect its image metadata, while preserving the live service and any prior rollback on recovery failure.

## 1.0.1 - 2026-08-04

### Added

- Authoritative Node 24 pull-request and main-branch CI with exact-head checkout, clean install, lint, full-program type diagnostic ratchet, tests, production build, and deploy behavior gates.
- Fail-closed CI contract tests and an application route smoke test.

### Documentation

- Run bounded deploy image and builder-cache cleanup only after live deployment identity verification.
