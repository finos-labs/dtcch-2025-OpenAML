import { createPool, Pool, PoolOptions, RowDataPacket, FieldPacket } from "mysql2/promise";
import { DBHost, DBDatabase, DBUser, DBPassword, DBPort } from "./secrets";

/* 
  * Class representing a database connector
  * Avaialbe methods:
  *   query - executes a SQL query using the connection pool
  *   close - closes the connection pool
*/
export class DBConnector {
  private pool!: Pool;

  // Constructor initializes the database connection pool
  constructor() {
    try {
      this.pool = this.createPool();
    } catch {
      console.log("Db error!");
    }
  }

  
  // Private method to create a MySQL connection pool
  private createPool(): Pool {
    // Define pool options with database connection details
    const poolOptions: PoolOptions = {
      host: DBHost,
      user: DBUser,
      database: DBDatabase,
      password: DBPassword,
      port: DBPort,
    };

    // Create and return a connection pool
    return createPool(poolOptions);
  }

  /**
   * Executes a SQL query using the connection pool.
   * @param sql - SQL query string.
   * @param where - An array of query parameters.
   * @returns A Promise that resolves to an array containing results and fields.
   */
  public async query(sql: string, where: any[] = []): Promise<[RowDataPacket[], FieldPacket[]]> {
    // Acquire a connection from the pool
    const connection = await this.pool.getConnection();
    try {
      // Execute the query using the acquired connection
      return await connection.query(sql, where);
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  }

  // Close the connection pool
  public async close(): Promise<void> {
    await this.pool.end();
  }
}
