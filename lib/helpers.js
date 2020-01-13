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
const moment_1 = __importDefault(require("moment"));
const api_1 = __importDefault(require("@actual-app/api"));
const v2_1 = __importDefault(require("csvtojson/v2"));
exports.ACTUAL_DATE_FORMAT = "YYYY-MM-DD";
exports.BLUECOINS_DATE_FORMAT = "DD/MM/YYYY";
exports.getJSON = (filepath) => __awaiter(void 0, void 0, void 0, function* () {
    const bluecoinsTransactions = yield v2_1.default().fromFile(filepath);
    return bluecoinsTransactions.map(tr => {
        return Object.assign(Object.assign({}, tr), { amount: parseFloat(tr.amount) });
    });
});
exports.getMyAccounts = () => {
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
exports.uploadAccounts = (accs) => __awaiter(void 0, void 0, void 0, function* () {
    const accsWithId = accs.map((acc) => __awaiter(void 0, void 0, void 0, function* () {
        const id = yield api_1.default.createAccount(acc, 0);
        return yield Object.assign(Object.assign({}, acc), { id });
    }));
    return Promise.all(accsWithId);
});
exports.getCategoryGroups = (transactions) => {
    const uniqueCategoryGroupStrings = Array.from(new Set(transactions
        .map(tr => {
        return { name: tr.category_group, is_income: tr.type === "Income" };
    })
        .map(cat_group => JSON.stringify(cat_group))));
    const uniqueCategoryGroups = uniqueCategoryGroupStrings.map(cat_g => JSON.parse(cat_g));
    return uniqueCategoryGroups;
};
exports.uploadCategoryGroups = (category_groups) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryGroupsWithId = category_groups.map((catg) => __awaiter(void 0, void 0, void 0, function* () {
        const id = yield api_1.default.createCategoryGroup(catg);
        return Object.assign(Object.assign({}, catg), { id });
    }));
    return Promise.all(categoryGroupsWithId);
});
exports.getCategories = (transactions, category_groups) => {
    const uniqueCategoryStrings = Array.from(new Set(transactions
        .map(tr => {
        return {
            name: tr.category,
            is_income: tr.type === "Income",
            group_id: tr.category_group
        };
    })
        .map(cat => JSON.stringify(cat))));
    const uniqueCategories = uniqueCategoryStrings.map(cat_g => {
        const category = JSON.parse(cat_g);
        const category_group = category_groups.find(catg => catg.name === category.group_id);
        const group_id = category_group !== undefined ? category_group.id : category.group_id;
        return Object.assign(Object.assign({}, category), { group_id });
    });
    return uniqueCategories;
};
exports.uploadCategories = (categories) => __awaiter(void 0, void 0, void 0, function* () {
    const categoriesWithId = categories.map((catg) => __awaiter(void 0, void 0, void 0, function* () {
        const id = yield api_1.default.createCategory(catg);
        return Object.assign(Object.assign({}, catg), { id });
    }));
    return Promise.all(categoriesWithId);
});
exports.getTransactions = (bluecoinsTransactions, categories, accounts) => {
    const transactions = bluecoinsTransactions.map(tr => {
        const { date, type, title, amount, category, account, notes, labels } = tr;
        const acc = accounts.find(acc => acc.name === account);
        const account_id = acc ? (acc.id ? acc.id : "") : "";
        const date_string = moment_1.default(date, exports.BLUECOINS_DATE_FORMAT).format(exports.ACTUAL_DATE_FORMAT);
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
exports.transactionsByAccount = (transactions) => {
    const accountsGrouped = [];
    transactions.forEach(tr => {
        const existingAccount = accountsGrouped.find(group => group.account_id === tr.account_id);
        if (existingAccount === undefined) {
            accountsGrouped.push({ account_id: tr.account_id, transactions: [tr] });
        }
        else {
            existingAccount.transactions.push(tr);
        }
    });
    return accountsGrouped;
};
exports.uploadTransactions = (transactionsGrouped) => __awaiter(void 0, void 0, void 0, function* () {
    const res = transactionsGrouped.map(gr => {
        return api_1.default.importTransactions(gr.account_id, gr.transactions);
    });
    return Promise.all(res);
});
