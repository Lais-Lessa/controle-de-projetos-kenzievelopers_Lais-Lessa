interface ProjectRow {
  id: number;
  name: string;
  description: string;
  repository: string;
  startDate: string;
  endDate: string | null;
  developerId: number | null;
}
