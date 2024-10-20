import { Injectable } from '@nestjs/common';
import {
  createConnection,
  queryPromise,
  closeConnection,
} from '@app/common/database/db/mysql';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    let connection;
    try {
      connection = await createConnection();
      const { results } = await queryPromise(connection, 'SELECT 1 as test');
      return `Database connection successful! Test query result: ${JSON.stringify(results)}`;
    } catch (error) {
      return `Database connection failed: ${error.message}`;
    } finally {
      if (connection) {
        await closeConnection(connection);
      }
    }
  }
}