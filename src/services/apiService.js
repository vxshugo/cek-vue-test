// src/services/apiService.js
import axios from 'axios'

const apiClient = axios.create({
	baseURL: 'https://dummyjson.com/products',
	headers: {
		'Content-Type': 'Application/json',
	},
})

export const fetchCategories = async () => {
	try {
		const response = await apiClient.get(`/category-list`)
		return response.data // Убедись, что API возвращает массив категорий
	} catch (error) {
		console.error('Error fetching categories:', error)
		throw error
	}
}
export const fetchProducts = async () => {
	try {
		const response = await apiClient.get()
		return response.data.products
	} catch (error) {
		console.error('Error fetching products:', error)
		throw error
	}
}
export const fetchProductsByCategory = async category => {
	try {
		const response = await apiClient.get(`${BASE_URL}/category/${category}`)
		return response.data.products // Убедись, что возвращается массив продуктов
	} catch (error) {
		console.error('Error fetching products by category:', error)
		throw error
	}
}
// Поиск продуктов
export const fetchProductsBySearch = async query => {
	try {
		const response = await apiClient.get(
			`/search?q=${encodeURIComponent(query)}`
		)
		return response.data.products
	} catch (error) {
		console.error('Error searching products:', error)
		throw error
	}
}
export default {
	fetchCategories,
	fetchProductsByCategory,
	fetchProducts,
	fetchProductsBySearch,
}
