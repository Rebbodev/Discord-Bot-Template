import { Client } from 'discord.js';

import { Command, DiscordEvent } from '../types/IEvents';

export class IEventsHandler {
    options: {
        Client: Client;
        Commands: Command[];
        Events: DiscordEvent[];
        guildIds: string[];
    };

    constructor(options: {
        Client: Client;
        Commands: Command[];
        Events: DiscordEvent[];
        guildIds: string[];
    }) {
        this.options = options;
    }

    //Sorts Guild and App Commands <3
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async sortCommands() {
        for (const command of this.options.Commands) {
            // If Guild Command If Statement Start
            if (command.config.guildOnly) {
                // Confirm Guilds Availability
                const confirmedGuilds = [];

                for (const guildId of this.options.guildIds) {
                    const getGuild =
                        this.options.Client.guilds.cache.get(guildId);

                    if (getGuild) confirmedGuilds.push(guildId);
                }

                for (const guild of confirmedGuilds) {
                    const getGuild =
                        this.options.Client.guilds.cache.get(guild);

                    const fetchCommands = await getGuild?.commands.fetch();
                    const findCommand = fetchCommands?.find(
                        (x) => x.name === command.data.name
                    );

                    if (!findCommand)
                        await getGuild?.commands.create(command.data);

                    if (findCommand && command.config.kill)
                        await getGuild?.commands.delete(findCommand.id);

                    if (command.config.update) {
                        if (findCommand)
                            await getGuild?.commands.delete(findCommand.id);

                        await getGuild?.commands.create(command.data);
                    }
                }

                // Start Sorting Application Commands
            } else {
                const fetchCommands =
                    await this.options.Client.application?.commands.fetch();
                const findCommand = fetchCommands?.find(
                    (x) => x.name === command.data.name
                );

                if (!findCommand)
                    await this.options.Client.application?.commands.create(
                        command.data
                    );

                if (findCommand && command.config.kill)
                    await this.options.Client.application?.commands.delete(
                        findCommand.id
                    );

                if (command.config.update) {
                    if (findCommand)
                        await this.options.Client.application?.commands.delete(
                            findCommand.id
                        );

                    await this.options.Client.application?.commands.create(
                        command.data
                    );
                }
            }
        }
    }

    //Cleans Up Commands Automatically
    async cleanupCommands() {
        //Cleaning Up Guild Commands
        const confirmedGuilds = [];

        for (const guildId of this.options.guildIds) {
            const getGuild = this.options.Client.guilds.cache.get(guildId);

            if (getGuild) confirmedGuilds.push(guildId);
        }

        for (const guild of confirmedGuilds) {
            const getGuild = this.options.Client.guilds.cache.get(guild);

            const fetchCommands = await getGuild?.commands.fetch();

            // eslint-disable-next-line unicorn/no-array-for-each
            fetchCommands?.forEach(async (cmd) => {
                const findCommand = this.options.Commands.find(
                    (x) => x.data.name === cmd.name
                );

                if (!findCommand) await getGuild?.commands.delete(cmd.id);
            });
        }

        // Cleaning Up Application Commands
        const fetchCommands =
            await this.options.Client.application?.commands.fetch();

        // eslint-disable-next-line unicorn/no-array-for-each
        fetchCommands?.forEach(async (cmd) => {
            const findCommand = this.options.Commands.find(
                (x) => x.data.name === cmd.name
            );

            if (!findCommand)
                await this.options.Client.application?.commands.delete(cmd.id);
        });
    }

    async launchEvents() {
        for (const event of this.options.Events) {
            this.options.Client.on(event.eventName, event.callback);
        }

        await this.sortCommands();
        await this.cleanupCommands();

        // Command Event Listener
        this.options.Client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;

            const { commandName } = interaction;

            const findCmd = this.options.Commands.find(
                (x) => x.data.name === commandName
            );

            if (!findCmd) {
                await interaction.reply({
                    content: 'This command is not available!',
                    ephemeral: true,
                });

                return;
            }

            findCmd.callback(interaction, this.options.Client);
        });
    }
}
