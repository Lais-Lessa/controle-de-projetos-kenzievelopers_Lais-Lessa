import format from "pg-format";
import { Developers, DevelopersCreate, DevelopersResults } from "../interfaces";
import { client } from "../database";
import AppError from "../error";
import { QueryResult } from "pg";

export const getDeveloperEmailQuery = async (
  email: DevelopersCreate
): Promise<QueryResult> => {
  const queryFormat: string = format(
    'SELECT * FROM "developers" WHERE email = %L;',
    email
  );

  const queryResult: DevelopersResults = await client.query(queryFormat);

  return queryResult;
};
