const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'tasks.db');

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
    });

    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create tasks table with user_id foreign key
    const createTasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        task TEXT NOT NULL,
        description TEXT,
        deadline DATE,
        completed BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;

    db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
        reject(err);
        return;
      }
      console.log('Users table created successfully');
      
      db.run(createTasksTable, (err) => {
        if (err) {
          console.error('Error creating tasks table:', err);
          reject(err);
          return;
        }
        console.log('Tasks table created successfully');
        db.close();
        resolve();
      });
    });
  });
}

function getDatabase() {
  return new sqlite3.Database(DB_PATH);
}

module.exports = {
  initializeDatabase,
  getDatabase
};