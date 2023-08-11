import { Request, Response } from "express";
import AppError from "../error";
import {
  fetchProjectInfoByIdQuery,
  insertNewProjectQuery,
  updateProjectQuery,
} from "../services/projects.service";
import { checkIdQuery } from "../services/developers.services";

const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
};

export const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, description, repository, startDate, endDate, developerId } =
    req.body;
  if (!name || !description || !repository || !startDate) {
    throw new AppError("Missing required fields.", 400);
  }

  const isValidStart = isValidDate(startDate);
  const isValidEnd = endDate ? isValidDate(endDate) : true;

  if (!isValidStart || !isValidEnd) {
    throw new AppError("Invalid date format. Use YYYY-MM-DD.", 400);
  }

  if (developerId !== undefined) {
    const developerExists = await checkIdQuery(developerId);
    if (developerExists.rowCount === 0) {
      throw new AppError("Developer not found.", 404);
    }
  }

  const newProject = await insertNewProjectQuery(
    name,
    description,
    repository,
    startDate,
    endDate,
    developerId
  );

  if (newProject.rowCount === 0) {
    throw new AppError("Failed to create project.", 400);
  }

  return res.status(201).json(newProject.rows[0]);
};

export const getProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);
  const queryResult = await fetchProjectInfoByIdQuery(id);
  if (queryResult.rowCount === 0) {
    throw new AppError("Project not found", 404);
  }
  const result = queryResult.rows[0];

  const formattedResult = {
    projectId: result.id,
    projectName: result.name,
    projectDescription: result.description,
    projectRepository: result.repository,
    projectStartDate: result.startDate,
    projectEndDate: result.endDate,
    projectDeveloperName: result.developerName,
  };

  return res.status(200).json(formattedResult);
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = Number(req.params.id);
  const projectData = req.body;
  const queryResult = await updateProjectQuery(id, projectData);
  return res.status(200).json(queryResult.rows[0]);
};
