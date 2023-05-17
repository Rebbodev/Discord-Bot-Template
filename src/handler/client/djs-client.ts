import { Client, IntentsBitField } from "discord.js";

export const djsClient =  new Client(
    {intents: [
        IntentsBitField.Flags.Guilds, 
        IntentsBitField.Flags.MessageContent, 
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers, 
        IntentsBitField.Flags.DirectMessages
    ]
})
