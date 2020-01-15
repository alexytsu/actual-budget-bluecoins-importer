export declare const ACTUAL_DATE_FORMAT: string;
export declare const BLUECOINS_DATE_FORMAT: string;
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
export declare const getJSON: (filepath: string) => Promise<BluecoinsTransaction[]>;
export declare const getMyAccounts: () => ActualAccount[];
export declare const uploadAccounts: (accs: ActualAccount[]) => Promise<ActualAccount[]>;
export declare const getCategoryGroups: (transactions: BluecoinsTransaction[]) => ActualCategoryGroup[];
export declare const uploadCategoryGroups: (category_groups: ActualCategoryGroup[]) => Promise<ActualCategoryGroup[]>;
export declare const getCategories: (transactions: BluecoinsTransaction[], category_groups: ActualCategoryGroup[]) => ActualCategory[];
export declare const uploadCategories: (categories: ActualCategory[]) => Promise<ActualCategory[]>;
export declare const getTransactions: (bluecoinsTransactions: BluecoinsTransaction[], prelim_categories: ActualCategory[], categories: ActualCategory[], accounts: ActualAccount[]) => ActualTransaction[];
export declare const cleanupCategories: (categories: ActualCategory[]) => Promise<void>;
export interface AccountGroupedTransactions {
    account_id: string;
    transactions: ActualTransaction[];
}
export declare const transactionsByAccount: (transactions: ActualTransaction[]) => AccountGroupedTransactions[];
export declare const uploadTransactions: (transactionsGrouped: AccountGroupedTransactions[]) => Promise<any[]>;
