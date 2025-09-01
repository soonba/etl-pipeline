export type Api3011LogStatus = 'FAIL' | 'SUCCESS';

export class Api3011Data {
  date: string;
  status: Api3011LogStatus;
  currentPage: number;
  node: string;
  detail: string;
}
export class Api3011Response {
  server: number;
  maxPage: number;
  currentPage: number;
  data: Api3011Data[];
}
