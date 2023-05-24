import { green, red } from 'colorette';
import pgp from 'pg-promise';
import pg from 'pg-promise/typescript/pg-subset';

export type PgsqlDatabaseConfig = {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    options: {
        enabled: boolean;
        priority: boolean;
    };
};

export const runPgsql = async (
    data: PgsqlDatabaseConfig
): Promise<pgp.IDatabase<{}, pg.IClient> | undefined> => {
    const { options, database, host, password, port, user } = data;
    const conData = {
        host: host,
        port: port,
        database: database,
        user: user,
        password: password,
    };

    if (!options.enabled) return undefined;

    // eslint-disable-next-line unicorn/prevent-abbreviations
    const pgsqlDb = pgp()(conData);
    let pgsqlFail = false;

    let databaseString = '';

    for (const index in data) {
        // eslint-disable-next-line no-constant-condition
        if (index !== 'password' && index !== 'user' && index !== 'options')
            databaseString += `\n${red(index)}: ${
                data[index as keyof PgsqlDatabaseConfig]
            }`;
    }

    await pgsqlDb
        .connect()
        .catch((error) => {
            pgsqlFail = true;
            const error_ = `${error}`;

            console.log(
                `${red('Failed to login into PostgresSQL')}:\n${error_.replace(
                    'Error',
                    red('Error')
                )}${databaseString}`
            );

            if (options.priority)
                throw new Error(
                    `The process was killed because a priority database connection failed! ${databaseString}`
                );
        })
        .then(() => {
            if (!pgsqlFail)
                console.log(
                    `${green(
                        'Successfully connected to PostgresSQL'
                    )}:${databaseString}`
                );
        });

    return pgsqlDb ? pgsqlDb : undefined;
};
