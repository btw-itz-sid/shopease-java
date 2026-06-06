const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Client } = require('pg');
const logger = require('../src/utils/logger') || console;

const createDatabase = async () => {
  // Connect to the default 'postgres' database first to create the new one
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: process.env.DB_PASSWORD || 'postgres', // Add your postgres password here if it fails
    port: 9508,
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query('SELECT datname FROM pg_database WHERE datname = $1', ['shopease']);
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE shopease');
      logger.info(' Database "shopease" created successfully.');
    } else {
      logger.info(' Database "shopease" already exists.');
    }
  } catch (err) {
    if (err.message && err.message.includes('authentication failed')) {
      logger.error(' Authentication failed! Please ensure your postgres user password is "postgres", or update the connection credentials in this script / your .env file.');
    } else {
      logger.error(' Failed to create database. Full error details below:');
      console.error(err);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
};

createDatabase();
