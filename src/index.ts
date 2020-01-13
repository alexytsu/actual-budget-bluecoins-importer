import api from "@actual-app/api";
import { getJSON } from "./bluecoins";

api.runImport("Budget", () => {});
console.log("Ran to Completion!");
