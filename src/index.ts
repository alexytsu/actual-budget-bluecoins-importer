import {
  getJSON,
  getMyAccounts,
  uploadAccounts,
  getCategoryGroups,
  uploadCategoryGroups,
  getCategories,
  uploadCategories,
  getTransactions,
  transactionsByAccount,
  uploadTransactions
} from "./helpers";
import api from "@actual-app/api";

api
  .runImport("Budget", async () => {
    const jsonTransactions = await getJSON(
      "./transaction_data/simplified_bluecoins_register.csv"
    );
    const accounts = await getMyAccounts();
    const accountsWithId = await uploadAccounts(accounts);
    console.log(accountsWithId);

    const categoryGroups = getCategoryGroups(jsonTransactions);
    const categoryGroupsWithId = await uploadCategoryGroups(categoryGroups);
    const categories = getCategories(jsonTransactions, categoryGroupsWithId);
    const categoriesWithId = await uploadCategories(categories);
    const transactions = getTransactions(
      jsonTransactions,
      categoriesWithId,
      accountsWithId
    );
    const transactionsGroupedByAccount = transactionsByAccount(transactions);

    const hi = await uploadTransactions(transactionsGroupedByAccount);

    console.log(hi);
  })
  .then(() => {
    console.log("Ran to Completion!");
  })
  .catch((e: Error) => console.error(e));
