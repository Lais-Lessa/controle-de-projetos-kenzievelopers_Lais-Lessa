import { Request, Response } from "express";
import { Developers } from "../interfaces";
import {
  createDeveloperQuery,
  deleteDevQuery,
  getDeveloperQuery,
  insertDeveloperInfoQuery,
  modifyDeveloper,
} from "../services/developers.services";

export const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developer: Developers = await createDeveloperQuery(req.body);

  return res.status(201).json(developer);
};

export const getDevelopers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const developer: Developers = await getDeveloperQuery(Number(id));
  return res.status(200).json(developer);
};

export const updateDevelopers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params; 
  const { email, name } = req.body; 
  const developerId = Number(id); 
  const result = await modifyDeveloper(developerId, name, email); 
  return res.status(200).json(result);
};

export const deleteDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params; 
  const developerId = Number(id); 
  await deleteDevQuery(developerId);
  return res.status(204).send();
};

export const createDeveloperInfos = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { developerSince, preferredOS } = req.body;
  const developerId = Number(id);

  const insertedInfo = await insertDeveloperInfoQuery(
    developerSince,
    preferredOS,
    developerId
  );

  return res.status(201).json(insertedInfo);
};
