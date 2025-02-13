export class ApplicationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export class DatabaseError extends ApplicationError {
  constructor(message: string) {
    super(message, 'DB_ERROR');
    this.name = 'DatabaseError';
  }
} 