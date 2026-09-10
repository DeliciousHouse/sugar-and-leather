# Changelog

All notable changes to this project are documented in this file.

## 1.0.5 - 2026-09-10

### Added

- Distinguish website calendar referrals by navigation, page, and call-to-action placement using public source labels, without collecting visitor data or changing the booking destination.

## 1.0.4 - 2026-08-14

### Fixed

- Keep production Docker builds reproducible by including tracked CI workflows and excluding machine-local agent worktrees from the build context.

## 1.0.3 - 2026-08-14

### Changed

- Keep website feedback private by sending only details the reporter enters and a bounded page pathname, without page URLs, referrers, or cookies.

### Fixed

- Prevent rapid or close-and-reopen submissions from creating duplicate feedback issues, while keeping keyboard focus inside the dialog during delivery.

### Removed

- Remove automatic console-error capture, page screenshots, image attachments, and their browser dependency from feedback reports.

## 1.0.2 - 2026-08-13

### Fixed

- Recover a verified rollback image from the commit served by the live container when Docker can no longer inspect its image metadata, while preserving the live service and any prior rollback on recovery failure.

## 1.0.1 - 2026-08-04

### Added

- Authoritative Node 24 pull-request and main-branch CI with exact-head checkout, clean install, lint, full-program type diagnostic ratchet, tests, production build, and deploy behavior gates.
- Fail-closed CI contract tests and an application route smoke test.

### Documentation

- Run bounded deploy image and builder-cache cleanup only after live deployment identity verification.
