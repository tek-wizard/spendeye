export const validate = (schema) => (req, res, next) => {
  const validation = schema.safeParse(req.body)

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: validation.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      })),
    })
  }

  req.validatedData = validation.data
  next()
}
