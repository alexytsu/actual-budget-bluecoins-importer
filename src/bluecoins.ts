import moment from "moment";

export interface Transaction {
  date: moment.Moment;
}

export const getJSON = (filepath: string): Transaction[] => {
  return [];
};
