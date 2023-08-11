import { QueryResult } from "pg";
import { client } from "../database";
import format from "pg-format";
import AppError from "../error";
import { checkIdQuery } from "./developers.services";

export const insertNewProjectQuery = async (
  name: string,
  description: string,
  repository: string,
  startDate: string,
  endDate: string,
  developerId: number
): Promise<QueryResult> => {
  const query = format(
    `INSERT INTO "projects" ("name", "description", "repository", "startDate", "endDate", "developerId") 
       VALUES (%L, %L, %L, %L, %L, %L) 
       RETURNING *;`,
    name,
    description,
    repository,
    startDate,
    endDate,
    developerId
  );

  const result: QueryResult = await client.query(query);
  return result;
};

export const fetchProjectInfoByIdQuery = async (
  projectId: number
): Promise<QueryResult> => {
  const query = format(
    `
      SELECT 
        "projects"."id",
        "projects"."name",
        "projects"."description",
        "projects"."repository",
        "projects"."startDate",
        "projects"."endDate",
        "projects"."developerId",
        "developers"."name" as "developerName"
      FROM "projects"
      LEFT JOIN "developers" ON "projects"."developerId" = "developers"."id"
      WHERE "projects"."id" = %L;
      `,
    projectId
  );

  const result: QueryResult = await client.query(query);
  return result;
};

export const updateProjectQuery = async (
  projectId: number,
  projectData: ProjectRow
): Promise<QueryResult> => {
  const { name, description, repository, startDate, endDate, developerId } =
    projectData;

  await checkIdQuery(Number(developerId));

  const query = format(
    `
      UPDATE projects
      SET 
      "name" = %L,
      "description" = %L,
      "repository" = %L,
      "startDate" = %L,
      "endDate" = %L,
      "developerId" = %L
      WHERE id =%L 
      RETURNING *;
      `,
    name,
    description,
    repository,
    startDate,
    endDate,
    developerId,
    projectId
  );

  const result = await client.query(query);

  if (result.rowCount === 0) {
    throw new AppError("Project not found", 404);
  }
  return result;
};
