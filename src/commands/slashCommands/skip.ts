import { CommandInteraction, SlashCommandBuilder, TextChannel } from 'discord.js';
import { client } from 'src/Bot';
import { fetchGuild } from 'src/database/queries/guilds/get';

import { skipCommand } from '../textCommands';

export const data = new SlashCommandBuilder().setName('skip').setDescription('Skip the currently played song !');

export async function execute(interaction: CommandInteraction) {
  const guild = await fetchGuild(interaction.guildId!);

  const channel = client.channels.cache.get(interaction.channelId!);
  if (!(channel instanceof TextChannel))
    return interaction.reply(
      `${i18n.t('embedsText.errors.arguments.unknown.title')} ${i18n.t(
        'embedsText.errors.arguments.textChannelNotFound'
      )} !`
    );

  const textChannel = channel as TextChannel;
  //@ts-expect-error : voiceChannel is not a property of interaction.member
  const voiceChannel = interaction.member.voice.channel;

  if (!guild)
    return interaction.reply(
      `${i18n.t('embedsText.errors.arguments.unknown.title')} ${i18n.t('embedsText.errors.arguments.guildNotFound')} !`
    );
  if (!voiceChannel)
    return interaction.reply(
      `${i18n.t('embedsText.errors.arguments.unknown.title')} ${i18n.t(
        'embedsText.errors.arguments.voiceChannelNotFound'
      )} !`
    );
  if (!textChannel)
    return interaction.reply(
      `${i18n.t('embedsText.errors.arguments.unknown.title')} ${i18n.t(
        'embedsText.errors.arguments.textChannelNotFound'
      )} !`
    );

  await skipCommand(guild.guildId, textChannel, interaction.user, voiceChannel);
  interaction.reply(`${i18n.t('global.understood')} !`);
  interaction.deleteReply();
  return;
}
