import * as ynab from "ynab";

/** YNAB API client with MoneyMovements (not exposed on the main API class). */
export type YnabClient = ynab.API & {
  moneyMovements: ynab.MoneyMovementsApi;
};

export function createYnabClient(accessToken: string): YnabClient {
  const api = new ynab.API(accessToken);
  const configuration = new ynab.Configuration({ accessToken });
  const moneyMovements = new ynab.MoneyMovementsApi(configuration);
  return Object.assign(api, { moneyMovements });
}
