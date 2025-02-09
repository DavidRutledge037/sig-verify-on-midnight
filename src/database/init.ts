import { DatabaseClient } from './client';
import { defaultConfig } from '../config/database';
import * as fs from 'fs';
import * as path from 'path';

export async function initializeDatabase() {
    const client = new DatabaseClient(defaultConfig);
    try {
        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema', 'init.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schema);
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    } finally {
        await client.close();
    }
} 