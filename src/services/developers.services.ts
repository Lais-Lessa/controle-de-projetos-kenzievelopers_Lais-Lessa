import format from "pg-format";
import { Developers, DevelopersCreate, DevelopersResults } from "../interfaces";
import { client } from "../database";
import AppError from "../error";
import { QueryResult } from "pg";

export const createDeveloperQuery = async (
  payload: DevelopersCreate
): Promise<Developers> => {
  const { name, email } = payload;

  const queryFormat: string = format(
    'INSERT INTO "developers" (name, email) VALUES (%L, %L) RETURNING *;',
    name,
    email
  );

 const queryResult: DevelopersResults = await client.query(queryFormat);

  if (typeof name !== "string" || typeof email !== "string") {
    throw new AppError("Invalid values typeof.", 400);
  }

  return queryResult.rows[0];
};

export const getDeveloperQuery = async (id: number): Promise<Developers> => {
  const queryFormat: string = format(
    `
   SELECT
   d.id as "developerId",
   d.name as "developerName",
   d.email as "developerEmail",
   di."developerSince" as  "developerInfoDeveloperSince",
   di."preferredOS" as  "developerInfoPreferredOS"
   FROM
   "developers" d
   LEFT JOIN
   "developerInfos" di
   ON d.id = di."developerId"
   WHERE
   d.id = %L
   `,
    id
  );

  const queryResult = await client.query(queryFormat);

  return queryResult.rows[0];
};

export const checkIdQuery = async (id: number): Promise<QueryResult> => {
  const query = format('SELECT * FROM "developers" WHERE id =%L;', id);

  const queryResult = await client.query(query);

  if (queryResult.rowCount === 0) {
    throw new AppError("Developer not found", 404);
  }
  return queryResult.rows[0];
};

export const modifyDeveloper = async (
  id: number,
  name: string,
  email: string
): Promise<Developers | null | undefined> => {
  const params = [email, id];
  let query = `UPDATE developers SET email = %L`;

  if (name !== undefined) {
    query += `, name = %L`;
    params.push(name);
  }

  query += ` WHERE id = %L RETURNING *`;

  const finallyQuery = format(query, ...params);

  const result = await client.query(finallyQuery);
  return result.rows[0];
};

export const deleteDevQuery = async (developerId: number): Promise<void> => {
  const queryResult = format(
    `DELETE FROM "developers" WHERE id = %L;`,
    developerId
  );
  await client.query(queryResult);
};

export const insertDeveloperInfoQuery = async (
  developerSince: string,
  preferredOS: string,
  developerId: number
): Promise<QueryResult> => {
  const query = format(
    'INSERT INTO "developerInfos" ("developerSince", "preferredOS", "developerId") VALUES (%L, %L, %L) RETURNING *;',
    developerSince, 
    preferredOS,
    developerId
  );
  const result = await client.query(query); 
  return result.rows[0]; 
};

export const checkPreferredOSValidity = async (
  osPreference: string
): Promise<void> => {
  const validityCheckQuery = format(
    //seleciona
    `
      SELECT CASE 
        WHEN %L = 'Windows' THEN true
        WHEN %L = 'Linux' THEN true
        WHEN %L = 'MacOS' THEN true
        ELSE false
      END as is_valid
    `,
    osPreference,
    osPreference,
    osPreference
  );

  const result = await client.query(validityCheckQuery);
  const isValidOS = result.rows[0]?.is_valid;

  if (!isValidOS) {
    throw new AppError("Invalid OS options.", 400);
  }
};

export const checkDeveloperInfoExistsQuery = async (
  developerId: number
): Promise<QueryResult> => {
  const query = format(
    `SELECT * FROM "developerInfos" WHERE "developerId" = %L`,
    developerId
  );
  const result: QueryResult = await client.query(query);
  return result;
};
