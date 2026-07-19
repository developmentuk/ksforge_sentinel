import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { SentinelCommand } from '../core/command.js';

export const forgeCommand: SentinelCommand = {
  data: new SlashCommandBuilder()
    .setName('forge')
    .setDescription('Connect to and manage your KSForge identity.')
    .addSubcommand((subcommand) =>
      subcommand.setName('about').setDescription('Learn about KSForge Sentinel.'))
    .addSubcommand((subcommand) =>
      subcommand.setName('status').setDescription('Check the Sentinel and KSForge connection.'))
    .addSubcommand((subcommand) =>
      subcommand.setName('register').setDescription('Create or connect your KSForge account.'))
    .addSubcommand((subcommand) =>
      subcommand.setName('link').setDescription('Link this Discord identity to an existing KSForge account.')),

  async execute(interaction, context) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'about') {
      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle('KSForge Sentinel')
          .setDescription('The official Discord companion for KSForge. One player identity, one alliance directory and one trusted content source across Discord and ksforge.app.')
          .setURL(context.env.KSFORGE_WEB_BASE_URL)],
        ephemeral: true
      });
      return;
    }

    if (subcommand === 'status') {
      await interaction.deferReply({ ephemeral: true });
      const health = await context.forge.health();
      await interaction.editReply(`Sentinel is online. KSForge API status: **${health.status}**.`);
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    const guildId = interaction.guildId ?? undefined;
    const registration = await context.forge.createRegistrationLink({
      discordUserId: interaction.user.id,
      ...(guildId ? { discordGuildId: guildId } : {}),
      discordUsername: interaction.user.username
    });

    await interaction.editReply({
      embeds: [new EmbedBuilder()
        .setTitle(subcommand === 'register' ? 'Join KSForge' : 'Link your KSForge account')
        .setDescription('Use the secure link below to continue on ksforge.app. The link is single-use and expires automatically.')
        .setURL(registration.url)
        .addFields({ name: 'Continue', value: `[Open KSForge](${registration.url})` })]
    });
  }
};
