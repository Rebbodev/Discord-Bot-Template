import {
    ChannelType,
    ChatInputCommandInteraction,
    Client,
    Colors,
    EmbedBuilder,
} from 'discord.js';

import { Command } from '../../handler/types/IEvents';

export const serverInfo: Command = {
    data: {
        name: 'serverinfo',
        description: 'displays the desired servers information',
    },
    config: {},
    callback: async (
        interaction: ChatInputCommandInteraction,
        client: Client
    ) => {
        const { guild } = interaction;

        if (!guild)
            return await interaction.reply({
                ephemeral: true,
                // eslint-disable-next-line quotes
                content: "Something that shouldn't happen; happened.",
            });

        // Channel Data
        const fetchChannels = await guild?.channels.fetch();
        const textChannels = fetchChannels?.filter(
            (x) => x?.type === ChannelType.GuildText
        ).size;
        const voiceChannels = fetchChannels?.filter(
            (x) => x?.type === ChannelType.GuildVoice
        ).size;

        // Member Data
        const fetchMembers = await guild?.members.fetch();
        const userCount = fetchMembers?.filter((x) => !x.user.bot).size;
        const botCount = fetchMembers?.filter((x) => x.user.bot).size;

        const date = new Date(guild.createdTimestamp).toDateString();

        const embed = new EmbedBuilder()
            .setTitle(`${guild?.name}'s Server Data`)
            .setImage(
                guild?.iconURL() ||
                    'https://errorcodeassistant.com/wp-content/uploads/2022/09/spectrum-error-1024x1024.png'
            )
            .setThumbnail(
                guild?.iconURL() ||
                    'https://errorcodeassistant.com/wp-content/uploads/2022/09/spectrum-error-1024x1024.png'
            )
            .setColor(Colors.Blurple)
            .addFields(
                {
                    name: 'Server Name',
                    value: `${guild?.name}`,
                    inline: true,
                },
                {
                    name: 'Created on',
                    value: `${date}`,
                    inline: true,
                },
                {
                    name: 'Guild Id',
                    value: `${guild?.id}`,
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                },
                {
                    name: 'Text Channels',
                    value: `${textChannels}`,
                    inline: true,
                },
                {
                    name: 'Voice Channels',
                    value: `${voiceChannels}`,
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true,
                },
                {
                    name: 'Member Count',
                    value: `${userCount}`,
                    inline: true,
                },
                {
                    name: 'Bot Count',
                    value: `${botCount}`,
                    inline: true,
                },
                {
                    name: '\u200B',
                    value: '\u200B',
                    inline: true,
                },
                {
                    name: 'Server Description',
                    value: `${guild?.description}`,
                }
            );

        await interaction.deferReply();
        await interaction.followUp({ embeds: [embed] });
    },
};
