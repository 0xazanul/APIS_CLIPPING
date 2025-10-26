export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unknown error occurred'
}

export const asyncHandler = <T>(fn: () => Promise<T>) => {
  return async () => {
    try {
      return await fn()
    } catch (error) {
      throw new Error(handleError(error))
    }
  }
}
