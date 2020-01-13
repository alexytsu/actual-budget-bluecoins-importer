import moment from "moment";
import api from "@actual-app/api";
import csv from "csvtojson/v2";

export const ACTUAL_DATE_FORMAT: string = "YYYY-MM-DD";
export const BLUECOINS_DATE_FORMAT: string = "DD/MM/YYYY";
export interface ActualTransaction {
  id?: string;
  account_id: string;
  date: string;
  amount?: number;
  payee?: string;
  payee_id?: string;
  imported_payee?: string;
  category_id?: string;
  notes?: string;
  imported_id?: string;
  transfer_id?: string;
  subtransactions?: ActualTransaction[];
}

export interface ActualAccount {
  id?: string;
  name: string;
  type: "checking" | "savings" | "investment" | "other";
}

export interface ActualCategory {
  id?: string;
  name: string;
  is_income: boolean;
  group_id: string;
}

export interface ActualCategoryGroup {
  id?: string;
  name: string;
  is_income: boolean;
}

export interface BluecoinsTransaction {
  type: "Expense" | "Income" | "Transfer" | "New Account";
  date: string;
  title: string;
  amount: number;
  category: string;
  category_group: string;
  account: string;
  notes: string;
  labels: string;
}

export const getJSON = async (
  filepath: string
): Promise<BluecoinsTransaction[]> => {
  const bluecoinsTransactions: any[] = await csv().fromFile(filepath);

  return bluecoinsTransactions.map(tr => {
    return { ...tr, amount: parseFloat(tr.amount) };
  });
};

export const getMyAccounts = (): ActualAccount[] => {
  return [
    { name: "Up", type: "checking" },
    { name: "Up Efund", type: "savings" },
    { name: "Westpac Chequing", type: "checking" },
    { name: "Up Saver", type: "savings" },
    { name: "Wallet", type: "other" },
    { name: "Coinbase", type: "investment" },
    { name: "Portfolio", type: "investment" },
    { name: "Westpac Investment", type: "investment" }
  ];
};

export const uploadAccounts = async (
  accs: ActualAccount[]
): Promise<ActualAccount[]> => {
  const accsWithId = accs.map(async acc => {
    const id = await api.createAccount(acc, 0);
    return await { ...acc, id };
  });

  return Promise.all(accsWithId);
};

export const getCategoryGroups = (
  transactions: BluecoinsTransaction[]
): ActualCategoryGroup[] => {
  const uniqueCategoryGroupStrings: string[] = Array.from(
    new Set(
      transactions
        .map(tr => {
          return { name: tr.category_group, is_income: tr.type === "Income" };
        })
        .map(cat_group => JSON.stringify(cat_group))
    )
  );

  const uniqueCategoryGroups: ActualCategoryGroup[] = uniqueCategoryGroupStrings.map(
    cat_g => JSON.parse(cat_g)
  );

  return uniqueCategoryGroups;
};

export const uploadCategoryGroups = async (
  category_groups: ActualCategoryGroup[]
): Promise<ActualCategoryGroup[]> => {
  const categoryGroupsWithId = category_groups.map(async catg => {
    const id = await api.createCategoryGroup(catg);
    return { ...catg, id };
  });

  return Promise.all(categoryGroupsWithId);
};

export const getCategories = (
  transactions: BluecoinsTransaction[],
  category_groups: ActualCategoryGroup[]
): ActualCategory[] => {
  const uniqueCategoryStrings: string[] = Array.from(
    new Set(
      transactions
        .map(tr => {
          return {
            name: tr.category,
            is_income: tr.type === "Income",
            group_id: tr.category_group
          };
        })
        .map(cat => JSON.stringify(cat))
    )
  );

  const uniqueCategories: ActualCategory[] = uniqueCategoryStrings.map(
    cat_g => {
      const category = JSON.parse(cat_g);
      const category_group = category_groups.find(
        catg => catg.name === category.group_id
      );

      const group_id: string =
        category_group !== undefined ? category_group.id : category.group_id;
      return { ...category, group_id };
    }
  );

  return uniqueCategories;
};

export const uploadCategories = async (
  categories: ActualCategory[]
): Promise<ActualCategory[]> => {
  const categoriesWithId = categories.map(async catg => {
    const id = await api.createCategory(catg);
    return { ...catg, id };
  });

  return Promise.all(categoriesWithId);
};

export const getTransactions = (
  bluecoinsTransactions: BluecoinsTransaction[],
  categories: ActualCategory[],
  accounts: ActualAccount[]
): ActualTransaction[] => {
  const transactions: ActualTransaction[] = bluecoinsTransactions.map(tr => {
    const { date, type, title, amount, category, account, notes, labels } = tr;

    const acc = accounts.find(acc => acc.name === account);
    const account_id = acc ? (acc.id ? acc.id : "") : "";

    const date_string = moment(date, BLUECOINS_DATE_FORMAT).format(
      ACTUAL_DATE_FORMAT
    );

    const cat = categories.find(cat => cat.name === category);
    const category_id = cat ? (cat.id ? cat.id : "") : "";

    return {
      account_id,
      category_id,
      date: date_string,
      amount: amount * 100,
      payee: title,
      notes: notes
    };
  });

  return transactions;
};

export interface AccountGroupedTransactions {
  account_id: string;
  transactions: ActualTransaction[];
}

export const transactionsByAccount = (
  transactions: ActualTransaction[]
): AccountGroupedTransactions[] => {
  const accountsGrouped: AccountGroupedTransactions[] = [];

  transactions.forEach(tr => {
    const existingAccount = accountsGrouped.find(
      group => group.account_id === tr.account_id
    );
    if (existingAccount === undefined) {
      accountsGrouped.push({ account_id: tr.account_id, transactions: [tr] });
    } else {
      existingAccount.transactions.push(tr);
    }
  });

  return accountsGrouped;
};

export const uploadTransactions = async (
  transactionsGrouped: AccountGroupedTransactions[]
): Promise<any[]> => {
  const res = transactionsGrouped.map(gr => {
    return api.importTransactions(gr.account_id, gr.transactions);
  });

  return Promise.all(res);
};
