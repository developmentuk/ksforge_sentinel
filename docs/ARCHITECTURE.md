# KSForge Sentinel Architecture

## Product boundary

KSForge is the platform and source of truth. KSForge Sentinel is the Discord interface to that platform.

Sentinel owns Discord-specific behaviour: slash commands, interactions, embeds, scheduled Discord delivery, server configuration and Discord permission mapping. It does not own canonical player, alliance, kingdom or editorial content records.

## System flow

```text
Discord user
  -> KSForge Sentinel
  -> authenticated KSForge Discord Integration API
  -> Forge application services
  -> Supabase and published Forge datasets
```

## Rules

1. Sentinel reads published content through versioned Forge APIs.
2. Sentinel never receives the Supabase service-role key.
3. Discord identities are linked through short-lived, single-use web flows.
4. A Discord server link does not grant global Forge administration.
5. Alliance membership is pending until verified under Forge alliance policy.
6. Every privileged mutation is audited by Forge.
7. Responses minimise personal data and default identity operations to ephemeral Discord messages.

## Initial API contract required from ksforge.app

- `GET /api/integrations/discord/v1/health`
- `POST /api/integrations/discord/v1/identity/registration-link`
- `GET /api/integrations/discord/v1/content/heroes/lookup?q=`
- `GET /api/integrations/discord/v1/content/events/today`
- `GET /api/integrations/discord/v1/content/giftcodes/active`

The Forge web application remains responsible for OAuth completion, account creation, player verification, alliance membership and consent management.
