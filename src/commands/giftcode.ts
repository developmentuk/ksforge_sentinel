import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { SentinelCommand } from '../core/command.js';

export const giftCodeCommand: SentinelCommand = {
  data: new SlashCommandBuilder()
    .setName('giftcode')
    .setDescription('View KSForge gift-code information.')
    .addSubcommand((subcommand) =>
      subcommand.setName('active').setDescription('Show currently active gift codes.')),

  async execute(interaction, context) {
    await interaction.deferReply({ ephemeral: true });
    const codes = await context.forge.getActiveGiftCodes();
    const embed = new EmbedBuilder().setTitle('Active Kingshot gift codes');
    embed.setDescription(codes.length
      ? codes.map((item) => `\`${item.code}\` — [details](${item.forgeUrl})`).join('\n')
      : 'KSForge currently has no active gift codes published.');
    await interaction.editReply({ embeds: [embed] });
  }
};
