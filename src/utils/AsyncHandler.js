const ansycHandler = (requestHandle) => async (req, res, next) => {
  try {
    await requestHandle(req, res, next);
  } catch (error) {
    res.status(error?.statusCode || 500).json({
      success: false,
      message: error.message || 'Something went wrong',
      errors: error?.errors || [],
    });
  }
};

export { ansycHandler };
