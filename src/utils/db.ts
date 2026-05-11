import { Sequelize } from 'sequelize'

import { Umzug, SequelizeStorage } from 'umzug'
import { DATABASE_URL } from './config.ts'

export const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
})

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }
}

export const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'src/migrations/*.ts',
      resolve: ({ name, path, context }) => {
        return {
          name,
          up: async () => {
            const migration = await import(`file://${path}`);
            return migration.up({ context });
          },
          down: async () => {
            const migration = await import(`file://${path}`);
            return migration.down({ context });
          },
        };
      },
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })
  
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
