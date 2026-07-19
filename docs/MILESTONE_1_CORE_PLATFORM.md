# Milestone 1 — Core Platform

## Objective

Deliver a production-ready KSForge Sentinel foundation that can securely connect Discord identities to KSForge accounts and act as a trusted client of the KSForge platform.

## Product boundary

KSForge remains the system of record for:

- player accounts and profiles
- Discord identity links
- kingdom and alliance membership
- permissions and verification state
- published Kingshot datasets

Sentinel stores no duplicate player or content records. It requests data through versioned KSForge integration APIs.

## Deliverables

### Foundation

- typed configuration
- structured logging and redaction
- central command registry
- consistent error handling
- health endpoint
- graceful shutdown

### Identity integration

- short-lived registration links
- Discord-to-KSForge account linking
- identity status lookup
- verified and unverified states
- replay-resistant link state
- guild context captured without trusting guild-supplied roles

### Discord experience

- `/forge about`
- `/forge status`
- `/forge register`
- `/forge link`
- private identity responses
- clear recovery messages for expired and failed links

### Deployment and quality

- Docker image
- GitHub Actions validation
- type checking
- unit tests
- production environment documentation
- release checklist

## Identity lifecycle

```text
unlinked
  -> registration_pending
  -> linked
  -> player_verified
  -> alliance_pending
  -> alliance_verified
```

A user may be linked without having a completed player profile. Alliance verification is a separate trust decision and must never be inferred from a Discord role alone.

## Required KSForge API surface

```text
GET  /api/integrations/discord/v1/health
POST /api/integrations/discord/v1/identity/registration-link
GET  /api/integrations/discord/v1/identity/status/:discordUserId
```

Future mutation endpoints must use idempotency keys and an authenticated Sentinel service identity.

## Completion criteria

Milestone 1 is complete only when:

1. CI passes on a clean checkout.
2. Sentinel can start with validated configuration.
3. `/forge register` returns a short-lived KSForge registration link.
4. Sentinel can retrieve and display the resulting identity state.
5. No service token or personal data appears in logs.
6. Failure paths are tested and documented.
7. The release branch is reviewed and merged through a pull request.
