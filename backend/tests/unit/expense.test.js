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
const addExpense_1 = require("../addExpense");
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
        const isAdded = (0, addExpense_1.addMockExpense)(userService, categoryService, expenseService);
        expect(isAdded).toBeTruthy();
    }));
    it('should increment the expense_id after each expense added', () => __awaiter(void 0, void 0, void 0, function* () {
        (0, addExpense_1.addMockExpense)(userService, categoryService, expenseService);
        (0, addExpense_1.addMockExpense)(userService, categoryService, expenseService);
        const all_expenses = expenseService.getAllExpenses();
        expect(all_expenses.length).toBe(2);
        expect(all_expenses[0].expense_id).toBe(0);
        expect(all_expenses[1].expense_id).toBe(1);
    }));
});
describe('Test modifying existing expenses', () => {
    let expenseService;
    let userService;
    let categoryService;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        expenseService = new expenseService_1.ExpenseServices();
        userService = new userService_1.UserService();
        categoryService = new categoryService_1.CategoryServices();
        yield (0, registerUser_1.jestRegister)('bob', 'password123', userService);
    }));
    it('should remove an expense from the list', () => {
        (0, addExpense_1.addMockExpense)(userService, categoryService, expenseService);
        let all_expenses = expenseService.getAllExpenses();
        expect(all_expenses.length).toBe(1);
        let isDeleted = expenseService.deleteExpense(all_expenses[0]);
        expect(isDeleted).toBeTruthy();
        all_expenses = expenseService.getAllExpenses();
        expect(all_expenses.length).toBe(0);
    });
    it('should modify the details of an expense', () => {
        (0, addExpense_1.addMockExpense)(userService, categoryService, expenseService);
        const expenseToEdit = expenseService.getAllExpenses()[0];
        const new_amount = 109.00;
        const new_name = "Final Fantasy VII Rebirth";
        const new_date = new Date();
        const new_expense_details = {
            new_amount, new_date, new_name
        };
        expenseService.editExpense(expenseToEdit, new_expense_details);
        const editedExpense = expenseService.getAllExpenses()[0];
        expect(editedExpense.currency).toEqual({ "cc": "NZD", "symbol": "NZ$", "name": "New Zealand dollar" }); // Stays the same
        expect(editedExpense.amount).toBe(109.00);
        expect(editedExpense.name).toBe("Final Fantasy VII Rebirth");
        expect(editedExpense.date).toBe(new_date);
        expect(editedExpense.category.name).toBe("Entertainment"); // Stays the same
    });
});
describe('Get expenses by month and year', () => {
    let expenseService;
    let userService;
    let categoryService;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        expenseService = new expenseService_1.ExpenseServices();
        userService = new userService_1.UserService();
        categoryService = new categoryService_1.CategoryServices();
        yield (0, registerUser_1.jestRegister)('bob', 'password123', userService);
    }));
    it("should return alice's expenses by month", () => {
        const user = userService.getAllUsers()[0];
        (0, addExpense_1.datedMockExpense)(userService, categoryService, expenseService, new Date('August, 31, 2023'));
        (0, addExpense_1.datedMockExpense)(userService, categoryService, expenseService, new Date('October, 10, 2023')); // Oct 2023
        (0, addExpense_1.datedMockExpense)(userService, categoryService, expenseService, new Date('December, 13, 2023')); // Dec 2023
        (0, addExpense_1.datedMockExpense)(userService, categoryService, expenseService, new Date('December, 26, 2023')); // Dec 2023
        const all_expenses = expenseService.getAllExpenses();
        const august = expenseService.getUserExpenseByMonth(user, 8, 2023);
        const october = expenseService.getUserExpenseByMonth(user, 10, 2023);
        const december = expenseService.getUserExpenseByMonth(user, 12, 2023);
        // Confirm correct number of expenses
        expect(august.length).toBe(1);
        expect(october.length).toBe(1);
        expect(december.length).toBe(2);
        // Confirm the validity of entries
        expect(august[0]).toBe(all_expenses[0]);
        expect(october[0]).toBe(all_expenses[1]);
        expect(december[0]).toBe(all_expenses[2]);
        expect(december[1]).toBe(all_expenses[3]);
    });
    it("should return all expenses from 2023", () => {
        const user = userService.getAllUsers()[0];
        (0, addExpense_1.datedMockExpense)(userService, categoryService, expenseService, new Date('August, 31, 2021'));
        (0, addExpense_1.datedMockExpense)(userService, categoryService, expenseService, new Date('October, 10, 2022'));
        (0, addExpense_1.datedMockExpense)(userService, categoryService, expenseService, new Date('December, 13, 2023'));
        (0, addExpense_1.datedMockExpense)(userService, categoryService, expenseService, new Date('December, 26, 2023'));
        const all_expenses = expenseService.getAllExpenses();
        const expenses_in_2021 = expenseService.getUserExpenseByYear(user, 2021);
        expect(expenses_in_2021.length).toBe(1);
        expect(expenses_in_2021[0]).toBe(all_expenses[0]);
        const expenses_in_2022 = expenseService.getUserExpenseByYear(user, 2022);
        expect(expenses_in_2022.length).toBe(1);
        expect(expenses_in_2022[0]).toBe(all_expenses[1]);
        const expenses_in_2023 = expenseService.getUserExpenseByYear(user, 2023);
        expect(expenses_in_2023.length).toBe(2);
        expect(expenses_in_2023[0]).toBe(all_expenses[2]);
        expect(expenses_in_2023[1]).toBe(all_expenses[3]);
    });
});
describe('Get expenses by category', () => {
    let expenseService;
    let userService;
    let categoryService;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        expenseService = new expenseService_1.ExpenseServices();
        userService = new userService_1.UserService();
        categoryService = new categoryService_1.CategoryServices();
        yield (0, registerUser_1.jestRegister)('bob', 'password123', userService);
    }));
    it("should return all of bob's expenses that are under entertainment", () => {
        const user = userService.getAllUsers()[0];
        const entertainment = categoryService.getCategoryByName('Entertainment');
        const foodndrink = categoryService.getCategoryByName('Food & Drink');
        expect(entertainment).not.toBeUndefined();
        expect(foodndrink).not.toBeUndefined();
        if (entertainment && foodndrink) {
            (0, addExpense_1.categorizedMockExpense)(userService, categoryService, expenseService, entertainment);
            (0, addExpense_1.categorizedMockExpense)(userService, categoryService, expenseService, entertainment);
            (0, addExpense_1.categorizedMockExpense)(userService, categoryService, expenseService, foodndrink);
            const all_expenses = expenseService.getAllExpenses();
            const entertainment_expenses = expenseService.getUserExpenseByCategory(user, entertainment);
            const foodndrink_expenses = expenseService.getUserExpenseByCategory(user, foodndrink);
            expect(entertainment_expenses.length).toBe(2);
            expect(foodndrink_expenses.length).toBe(1);
        }
    });
});
