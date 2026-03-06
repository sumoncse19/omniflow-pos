import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  constructor(public message: string, public status: number) {
    super(message)
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // our own errors
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message })
  }

  // postgres check constraint (negative stock etc)
  if (err.code === '23514') {
    return res.status(409).json({ error: 'Insufficient stock' })
  }

  // postgres unique violation
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Already exists' })
  }

  // postgres foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Referenced item not found' })
  }

  console.error(err)
  res.status(500).json({ error: 'Something went wrong' })
}
