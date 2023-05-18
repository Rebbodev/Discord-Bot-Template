/* eslint-disable unused-imports/no-unused-vars */
import { Client, ClientEvents } from 'discord.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { ChatInputApplicationCommandData } from 'discord.js';

export interface Command {
    data: ChatInputApplicationCommandData;
    config: {
        guildOnly?: boolean;
        kill?: boolean;
        update?: boolean;
    };
    callback: (
        interaction: ChatInputCommandInteraction,
        client: Client
    ) => Promise<unknown>;
}

export interface DiscordEvent {
    eventName: keyof ClientEvents;
    callback: (...arguments_: any[]) => Promise<void>;
}
