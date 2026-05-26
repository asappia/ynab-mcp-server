import * as ynab from "ynab";
export function createYnabClient(accessToken) {
    const api = new ynab.API(accessToken);
    const configuration = new ynab.Configuration({ accessToken });
    const moneyMovements = new ynab.MoneyMovementsApi(configuration);
    return Object.assign(api, { moneyMovements });
}
