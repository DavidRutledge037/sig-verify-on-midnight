import type { Container } from '../../src/core/container';
import type { DatabaseService } from '../../src/services/database.service';
import type { MongoMemoryServer } from 'mongodb-memory-server';

declare global {
  var testContext: {
    container: Container;
    databaseService: DatabaseService;
    mongod: MongoMemoryServer;
  };
}

export {};