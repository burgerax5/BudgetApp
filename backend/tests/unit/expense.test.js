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
Object.defineProperty(exports, "__esModule", { value: true });
const expenseService_1 = require("../../src/services/expenseService");
const userService_1 = require("../../src/services/userService");
const categoryService_1 = require("../../src/services/categoryService");
const registerUser_1 = require("../registerUser");
function addMockExpense(userService, categoryService, expenseService) {
    var _a, _b;
    // Parameters for expense
    const user_id = (_a = userService.getUserByUsername('bob')) === null || _a === void 0 ? void 0 : _a.user_id;
    const currency = { "cc": "NZD", "symbol": "NZ$", "name": "New Zealand dollar" };
    const amount = 49.99;
    const name = "Cyberpunk 2077: Phantom Liberty";
    const date = new Date();
    const category_id = (_b = categoryService.getCategoryByName('Entertainment')) === null || _b === void 0 ? void 0 : _b.category_id;
    let isAdded = false;
    if (user_id !== undefined) {
        isAdded = expenseService.addExpense(user_id, currency, amount, name, date, category_id);
    }
    return isAdded;
}
describe('Test initialization and adding', () => {
    let expenseService;
    let userService;
    let categoryService;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        expenseService = new expenseService_1.ExpenseServices();
        userService = new userService_1.UserService();
        categoryService = new categoryService_1.CategoryServices();
        yield (0, registerUser_1.jestRegister)('bob', 'password123', userService);
    }));
    it('should initially be an empty list', () => {
        const all_expenses = expenseService.getAllExpenses();
        expect(all_expenses).toEqual([]);
    });
    it('should add a new expense', () => __awaiter(void 0, void 0, void 0, function* () {
        const isAdded = addMockExpense(userService, categoryService, expenseService);
        expect(isAdded).toBeTruthy();
    }));
    it('should add multiple expenses', () => __awaiter(void 0, void 0, void 0, function* () {
        addMockExpense(userService, categoryService, expenseService);
        addMockExpense(userService, categoryService, expenseService);
        expect(expenseService.getAllExpenses().length).toBe(2);
    }));
});
describe('Test modifying existing expense', () => {
});
