import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { SentinelCommand } from '../core/command.js';

export const eventCommand: SentinelCommand = {
  data: new SlashCommandBuilder()
    .setName('event')
    .setDescription('View published KSForge event information.')
    .addSubcommand((subcommand) =>
      subcommand.setName('today').setDescription('Show today’s active and upcoming events.')),

  async execute(interaction, context) {
    await interaction.deferReply();
    const result = await context.forge.getTodayEvents();
    const embed = new EmbedBuilder().setTitle('Today on KSForge');
    if (result.events.length === 0) {
      embed.setDescription('No scheduled events are currently published for today.');
    } else {
      embed.addFields(result.events.slice(0, 10).map((event) => ({
        name: `${event.name} — ${event.status}`,
        value: `${event.summary ?? 'Open KSForge for full guidance.'}\n[View on KSForge](${event.forgeUrl})`
      })));
    }
    await interaction.editReply({ embeds: [embed] });
  }
};
