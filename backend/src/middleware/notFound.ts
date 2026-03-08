import { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
  res
    .status(404)
    .json({ error: `API endpoint ${req.method} ${req.originalUrl} not found` });
};

export default notFound;
