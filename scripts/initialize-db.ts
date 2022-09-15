import minimist from 'minimist'

import dbClient from '../src/utils/db'

const argv = minimist(process.argv.slice(2))

dbClient.connect(err => {
  if (err) {
    console.log(err)
  } else {
    console.log('Connected to the DB')
  }
})

const shouldDropData = argv.drop

async function initializeDB() {
  try {
    if (shouldDropData) {
      await dbClient.query('DROP TABLE IF EXISTS users CASCADE')
    }

    await dbClient.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(60) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT 'now'::timestamp
      )
    `)

    console.log('databae initialized successfully.')
  } catch (err) {
    console.error('could not initialize databae', err)
    process.exit(1)
  } finally {
    dbClient.close()
  }
}

initializeDB().then(() => process.exit(0))
