import { Client, Events, GatewayIntentBits } from 'discord.js';
import { commands } from './commands/index.js';
import { loadEnv } from './config/env.js';
import { createLogger } from './core/logger.js';
import { createCommandRegistry } from './core/registry.js';
import { ForgeApiClient } from './forge/client.js';
import { startHealthServer } from './http/server.js';

const env = loadEnv();
const logger = createLogger(env.LOG_LEVEL);
const forge = new ForgeApiClient({
  baseUrl: env.KSFORGE_API_BASE_URL,
  serviceToken: env.KSFORGE_SERVICE_TOKEN
});
const registry = createCommandRegistry(commands);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  logger.info({ botUser: readyClient.user.tag }, 'KSForge Sentinel connected to Discord');
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = registry.get(interaction.commandName);
  if (!command) {
    logger.warn({ command: interaction.commandName }, 'Unknown command received');
    return;
  }
  try {
    await command.execute(interaction, { env, forge, logger });
  } catch (error) {
    logger.error({ err: error, command: interaction.commandName }, 'Command failed');
    const message = 'KSForge Sentinel could not complete that request. Please try again shortly.';
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: message, embeds: [], components: [] }).catch(() => undefined);
    } else {
      await interaction.reply({ content: message, ephemeral: true }).catch(() => undefined);
    }
  }
});

const healthServer = startHealthServer(env.PORT, client, logger);

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down KSForge Sentinel');
  healthServer.close();
  client.destroy();
  process.exit(0);
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

await client.login(env.DISCORD_TOKEN);
