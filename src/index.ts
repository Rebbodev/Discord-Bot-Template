import { config } from 'dotenv';

import { EventHandler } from './Events/builder';
import { djsClient } from './handler/client/djs-client';
config();

(async () => {
    await djsClient
        .login(process.env.DISCORD_APP_TOKEN)
        .catch(() => {
            console.log(
                'Failed to authorize the provided discord token, please ensure the token is valid!'
            );
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit(1);
        })
        .then(() => {
            console.log('Authorization to the discord bot was successful!');
        });

    djsClient.on('ready', async () => {
        //Build the project here

        console.log(
            `The application ${djsClient.user?.username} is now ready!`
        );

        EventHandler.launchEvents();
    });
})();
