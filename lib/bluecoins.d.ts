export declare const ACTUAL_DATE_FORMAT: string;
export declare const BLUECOINS_DATE_FORMAT: string;
export interface ActualTransaction {
    id: string;
    account_id: string;
    date: string;
    amount?: number;
    payee_id?: string;
    imported_payee?: string;
    category_id?: string;
    notes?: string;
    imported_id?: string;
    transfer_id?: string;
    subtransactions?: ActualTransaction[];
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
