import moment from "moment";
export interface Transaction {
    date: moment.Moment;
}
export declare const getJSON: (filepath: string) => Transaction[];
