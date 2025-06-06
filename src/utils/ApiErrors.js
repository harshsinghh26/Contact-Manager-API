class ApiError extends Error {
  constructor(statusCode, message = 'Something went Wrong', errors = []) {
    super(message);
    (this.statusCode = statusCode),
      (this.data = null),
      (this.errors = errors),
      (this.success = false);
  }
}

export { ApiError };
