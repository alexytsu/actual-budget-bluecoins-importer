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
  uploadTransactions,
  cleanupCategories
} from "./helpers";
import api from "@actual-app/api";

api
  .runImport("Budget 2", async () => {
    const jsonTransactions = await getJSON(
      "./transaction_data/simplified_bluecoins_register.csv"
    );
    const accounts = await getMyAccounts();
    const accountsWithId = await uploadAccounts(accounts);

    const categoryGroups = getCategoryGroups(jsonTransactions);
    const categoryGroupsWithId = await uploadCategoryGroups(categoryGroups);
    const categories = getCategories(jsonTransactions, categoryGroupsWithId);
    const uploadedcategories = await uploadCategories(categories);

    const payees = await api.getPayees();

    const actualCategoriesWithId = await api.getCategories();
    const transactions = getTransactions(
      jsonTransactions,
      categories,
      actualCategoriesWithId,
      accountsWithId,
      payees
    );

    const transactionsGroupedByAccount = transactionsByAccount(transactions);
    const results = await uploadTransactions(transactionsGroupedByAccount);

    console.log(results);
  })
  .then(() => {
    console.log("Ran to Completion!");
  })
  .catch((e: Error) => console.error(e));
