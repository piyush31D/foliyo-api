import httpStatus from 'http-status';

/**
 * @extends Error
 */
export class ExtendableError extends Error {
  status: any;
  constructor(message: string, status: any) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
  }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
export class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   */
  constructor(message: any, status: number = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status);
  }
}


/**
 * Class representing an Mongo error.
 * @extends ExtendableError
 */
export class MongoError extends ExtendableError {
  /**
   * Creates an Mongo error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   */
  constructor(message: any, status: number = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status);
  }
}

export default APIError;
