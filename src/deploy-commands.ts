import { REST, Routes } from 'discord.js';
import { commands } from './commands/index.js';
import { loadEnv } from './config/env.js';

const env = loadEnv();
const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
const body = commands.map((command) => command.data.toJSON());

if (env.DISCORD_GUILD_ID) {
  await rest.put(Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID), { body });
  console.log(`Deployed ${body.length} guild commands.`);
} else {
  await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body });
  console.log(`Deployed ${body.length} global commands.`);
}
