"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const api_1 = __importDefault(require("@actual-app/api"));
api_1.default
    .runImport("Budget", () => __awaiter(void 0, void 0, void 0, function* () {
    const jsonTransactions = yield helpers_1.getJSON("./transaction_data/simplified_bluecoins_register.csv");
    const accounts = yield helpers_1.getMyAccounts();
    const accountsWithId = yield helpers_1.uploadAccounts(accounts);
    console.log(accountsWithId);
    const categoryGroups = helpers_1.getCategoryGroups(jsonTransactions);
    const categoryGroupsWithId = yield helpers_1.uploadCategoryGroups(categoryGroups);
    const categories = helpers_1.getCategories(jsonTransactions, categoryGroupsWithId);
    const categoriesWithId = yield helpers_1.uploadCategories(categories);
    const transactions = helpers_1.getTransactions(jsonTransactions, categoriesWithId, accountsWithId);
    const transactionsGroupedByAccount = helpers_1.transactionsByAccount(transactions);
    const hi = yield helpers_1.uploadTransactions(transactionsGroupedByAccount);
    console.log(hi);
}))
    .then(() => {
    console.log("Ran to Completion!");
})
    .catch((e) => console.error(e));
