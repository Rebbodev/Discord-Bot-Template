import { config } from 'dotenv';
import pgPromise from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';

import { EventHandler } from './Events/builder';
import { djsClient } from './handler/client/djs-client';
import { runPgsql } from './SQL/PgSQL/connection';
import { pgsqlCon1 } from './SQL/PgSQL/databases/pgsql1';
config();

export let database: pgPromise.IDatabase<{}, pg.IClient> | undefined;

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

        database = await runPgsql(pgsqlCon1);
    });
})();
