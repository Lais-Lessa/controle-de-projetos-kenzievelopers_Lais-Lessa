import { NextFunction, Request, Response } from "express";
import { getDeveloperEmailQuery } from "../services/middlewares.service";
import AppError from "../error";
import {
  checkDeveloperInfoExistsQuery,
  checkIdQuery,
  checkPreferredOSValidity,
} from "../services/developers.services";

export const checkEmailMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const queryResult = await getDeveloperEmailQuery(email);

  if (queryResult.rowCount > 0) {
    throw new AppError("Email already exists.", 409);
  }

  return next();
};

export const checkIdMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const queryResult = await checkIdQuery(Number(id));

  if (queryResult.rowCount === 0) {
    throw new AppError("Developer not found.", 404);
  }

  return next();
};

export const checkDeveloperInfoExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { preferredOS } = req.body;
  const developerId = Number(id);

  await checkPreferredOSValidity(preferredOS);

  const result = await checkDeveloperInfoExistsQuery(developerId);

  if (result.rowCount > 0) {
    throw new AppError("Developer infos already exist.", 409);
  }

  next();
};
