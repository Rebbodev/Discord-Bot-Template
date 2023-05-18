import { guildsArr1 as guildsArray1 } from '../config.json';
import { IEventsHandler } from '../handler/class/IEventsHandler';
import { djsClient } from '../handler/client/djs-client';
import { serverInfo } from './server/serverinfo';

export const EventHandler = new IEventsHandler({
    Client: djsClient,
    Commands: [serverInfo],
    Events: [],
    guildIds: [...guildsArray1],
});
