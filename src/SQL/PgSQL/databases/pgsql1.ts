import { config } from 'dotenv';

import { PgsqlDatabaseConfig } from '../connection';
config();

export const pgsqlCon1: PgsqlDatabaseConfig = {
    host: process.env.PGSQL1_HOST || 'local',
    port: Number(process.env.PGSQL1_PORT || 1111),
    database: process.env.PGSQL1_DATABASE || 'myDatabaseName',
    user: process.env.PGSQL1_USER || 'myUsername',
    password: process.env.PGSQL1_PASSWORD || 'myPassword',
    options: {
        enabled: true,
        priority: true,
    },
};
