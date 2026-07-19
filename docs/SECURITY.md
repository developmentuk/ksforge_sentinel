# Security Model

- Store Discord and KSForge service tokens only in deployment secrets.
- Use a dedicated, rotatable Sentinel service credential with narrow API scope.
- Never expose service credentials in Discord interactions, logs or browser URLs.
- Registration links must be random, single-use, bound to the Discord identity and short-lived.
- Forge must validate guild, user and alliance permissions for every mutation.
- Sentinel should request only the Discord `applications.commands` and `bot` scopes and begin with the `Guilds` gateway intent only.
- Privileged commands must default to ephemeral responses where appropriate.
- All external responses are validated before they are rendered into Discord.
