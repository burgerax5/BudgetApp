import { CategoryServices } from "../../src/services/categoryService";
import { Category } from "../../src/models/Category";

describe('Test we initialize categories properly', () => {
    const categoryServices: CategoryServices = new CategoryServices()

    it('should have 7 default categories', () => {
        const numCategories = categoryServices.getAllCategories().length
        expect(numCategories).toBe(7)
    })
})

describe('Test we can get the category object by the name', () => {
    const categoryServices: CategoryServices = new CategoryServices()

    it('should return the category object of "Entertainment"', () => {
        const entertainment = categoryServices.getCategoryByName('Entertainment')
        expect(entertainment).not.toBeUndefined
        expect(entertainment).toEqual({category_id: 1, name: "Entertainment", colour: "#f54e42"})
    })
})