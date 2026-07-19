import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { SentinelCommand } from '../core/command.js';

export const heroCommand: SentinelCommand = {
  data: new SlashCommandBuilder()
    .setName('hero')
    .setDescription('Search published KSForge hero content.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('lookup')
        .setDescription('Find a hero.')
        .addStringOption((option) =>
          option.setName('name').setDescription('Hero name').setRequired(true))),

  async execute(interaction, context) {
    await interaction.deferReply();
    const query = interaction.options.getString('name', true);
    const hero = await context.forge.getHero(query);
    const embed = new EmbedBuilder()
      .setTitle(hero.name)
      .setURL(hero.forgeUrl)
      .setDescription(hero.summary ?? 'Open the full KSForge hero page for progression, skills and guidance.')
      .addFields(
        ...(hero.rarity ? [{ name: 'Rarity', value: hero.rarity, inline: true }] : []),
        ...(hero.generation ? [{ name: 'Generation', value: String(hero.generation), inline: true }] : []),
        ...(hero.troopType ? [{ name: 'Troop type', value: hero.troopType, inline: true }] : [])
      );
    if (hero.imageUrl) embed.setThumbnail(hero.imageUrl);
    await interaction.editReply({ embeds: [embed] });
  }
};
