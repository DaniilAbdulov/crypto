import {createDb} from '../../../../packages/pg/src/knex';

import knexConfig from '../../knexfile';

export const db = createDb(knexConfig);
