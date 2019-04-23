import sqlite3 from 'sqlite3'

class Database {
  constructor(databaseFilePath: string) {
    this.database = new sqlite3.Database(databaseFilePath, (error: Error) => {
      if (error) throw error
    })
  }

  private database: sqlite3.Database

  protected async dbAll(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.database.all(query, (error, rows) => {
        if (error) reject(error)
        else resolve(rows)
      })
    })
  }

  protected async dbGet(query: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database.get(query, params, (error, row) => {
        if (error) reject(error)
        else resolve(row)
      })
    })
  }

  protected async dbRun(query: string, params?: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.database.run(query, params, error => {
        if (error) reject(error)
        else resolve(true)
      })
    })
  }
}

export default Database
