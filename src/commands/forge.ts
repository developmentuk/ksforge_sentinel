import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder
} from 'discord.js';
import type { SentinelCommand } from '../core/command.js';
import type { IdentityStatus } from '../forge/contracts.js';

const identityLabels: Record<IdentityStatus['status'], string> = {
  unlinked: 'Not connected',
  registration_pending: 'Registration pending',
  linked: 'Discord connected',
  player_verified: 'Player verified',
  alliance_pending: 'Alliance verification pending',
  alliance_verified: 'Alliance verified'
};

function buildIdentityEmbed(identity: IdentityStatus, forgeBaseUrl: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle('Your KSForge identity')
    .setURL(forgeBaseUrl)
    .setDescription(`Status: **${identityLabels[identity.status]}**`)
    .setTimestamp(new Date(identity.updatedAt));

  if (identity.displayName) {
    embed.addFields({ name: 'Player', value: identity.displayName, inline: true });
  }

  if (identity.kingdomNumber) {
    embed.addFields({ name: 'Kingdom', value: `#${identity.kingdomNumber}`, inline: true });
  }

  if (identity.allianceTag) {
    embed.addFields({ name: 'Alliance', value: identity.allianceTag, inline: true });
  }

  if (identity.status === 'registration_pending') {
    embed.setFooter({ text: 'Complete the secure KSForge registration to finish connecting your account.' });
  } else if (identity.status === 'alliance_pending') {
    embed.setFooter({ text: 'Your player is connected. Alliance verification is still awaiting completion.' });
  } else if (identity.status === 'alliance_verified') {
    embed.setFooter({ text: 'Your Discord, player and alliance identities are connected to KSForge.' });
  }

  return embed;
}

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

    const identity = await context.forge.getIdentityStatus(interaction.user.id);
    if (identity.status !== 'unlinked') {
      const components = identity.status === 'registration_pending'
        ? []
        : [new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setLabel('Open KSForge')
              .setStyle(ButtonStyle.Link)
              .setURL(context.env.KSFORGE_WEB_BASE_URL)
          )];

      await interaction.editReply({
        embeds: [buildIdentityEmbed(identity, context.env.KSFORGE_WEB_BASE_URL)],
        components
      });
      return;
    }

    const guildId = interaction.guildId ?? undefined;
    const registration = await context.forge.createRegistrationLink({
      discordUserId: interaction.user.id,
      ...(guildId ? { discordGuildId: guildId } : {}),
      discordUsername: interaction.user.username
    });

    const actionLabel = subcommand === 'register' ? 'Create or connect account' : 'Link existing account';
    await interaction.editReply({
      embeds: [new EmbedBuilder()
        .setTitle(subcommand === 'register' ? 'Join KSForge' : 'Link your KSForge account')
        .setDescription('Continue securely on KSForge. This single-use link expires automatically and only connects the Discord identity that requested it.')
        .setURL(registration.url)
        .addFields(
          { name: 'Discord account', value: interaction.user.username, inline: true },
          { name: 'Link expires', value: `<t:${Math.floor(new Date(registration.expiresAt).getTime() / 1000)}:R>`, inline: true }
        )],
      components: [new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel(actionLabel)
          .setStyle(ButtonStyle.Link)
          .setURL(registration.url)
      )]
    });
  }
};