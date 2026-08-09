# BookHub Production Readiness

## Completed in code

- React/Vite application with protected tRPC procedures.
- RBAC primitives for authenticated users and administrators.
- Listing create/update/delete with ownership checks.
- External-link validation for external listings.
- Favorites and follows with duplicate/self-follow protection.
- Message access checks for conversation participants.
- Notification ownership checks.
- Rating validation, self-rating protection, listing ownership validation, and duplicate protection.
- Report submission with target validation.
- Administrator-only report listing and resolution API.
- Admin report moderation screen at `/admin/reports`.
- Pagination input limits to reduce abusive/unbounded queries.
- Production security headers and safer request-size limits.
- GitHub Actions CI for typecheck, tests, and production build.

## Intentionally blocked until external integrations are configured

### Payments
Paid subscriptions must not become active without a confirmed payment. The application currently allows free plans and rejects paid-plan activation until a real payment provider/webhook is configured.

Required before launch:
- Production payment provider credentials.
- Server-side payment intent/order creation.
- Signed webhook verification.
- Idempotency and payment reconciliation.
- Invoice/receipt handling.

### Storage
S3-compatible storage must be configured before production image uploads are enabled.

Required:
- Bucket and region.
- Server credentials/secrets.
- Signed upload/download policy.
- Image type/size validation.
- Malware/content scanning policy if required.

### OAuth / email / push
Production credentials and callback URLs are required for external OAuth providers, transactional email, and push notifications.

## Final verification required before public launch

1. Run `pnpm install --frozen-lockfile`.
2. Run `pnpm check`.
3. Run `pnpm test` with a test database configured for integration tests.
4. Run `pnpm build`.
5. Apply database migrations to a staging database.
6. Execute end-to-end flows on mobile and desktop.
7. Configure production secrets only after staging passes.
8. Verify payment webhooks and storage uploads in staging.
9. Perform a final security and privacy review.

## Readiness policy

A feature is considered complete when its server-side behavior is real, authorized, validated, and testable. External services are tracked as integration blockers rather than simulated as successful production operations.
