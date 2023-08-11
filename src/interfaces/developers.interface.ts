import { QueryResult } from "pg";

type Developers = {
  id: number;
  name: string;
  email: string;
};

type DevelopersResults = QueryResult<Developers>;
type DevelopersCreate = Omit<Developers, "id">;
export { Developers, DevelopersResults, DevelopersCreate };
