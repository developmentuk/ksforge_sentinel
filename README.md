# KSForge Sentinel

**KSForge Sentinel** is the official Discord companion for [KSForge](https://ksforge.app).

It is an original, from-the-ground-up product. KSForge remains the source of truth for player identity, alliance membership, kingdom data and published game content. Sentinel provides a Discord-native route into the same platform.

## Foundation commands

- `/forge about`
- `/forge status`
- `/forge register`
- `/forge link`
- `/hero lookup`
- `/event today`
- `/giftcode active`

## Local setup

1. Install Node.js 24 LTS.
2. Copy `.env.example` to `.env` and add development credentials.
3. Run `npm install`.
4. Deploy commands with `npm run commands:deploy`.
5. Start the bot with `npm run dev`.

Use `DISCORD_GUILD_ID` during development so command changes appear immediately in one test server. Remove it when deploying global commands.

## Platform principle

```text
Discord strengthens KSForge.
KSForge powers Discord.
```

See [Architecture](docs/ARCHITECTURE.md), [Roadmap](docs/ROADMAP.md) and [Security](docs/SECURITY.md).
