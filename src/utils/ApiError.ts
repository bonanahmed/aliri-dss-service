class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public status: string;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = "",
    status = "error"
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = status;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
