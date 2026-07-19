import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import type { ForgeApiClient } from '../forge/client.js';
import type { AppEnv } from '../config/env.js';
import type { Logger } from './logger.js';

export interface CommandContext {
  env: AppEnv;
  forge: ForgeApiClient;
  logger: Logger;
}

export interface SentinelCommand {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute(interaction: ChatInputCommandInteraction, context: CommandContext): Promise<void>;
}
