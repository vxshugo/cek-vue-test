// src/services/apiService.js
import axios from 'axios'

const apiClient = axios.create({
	baseURL: 'https://dummyjson.com/products',
	headers: {
		'Content-Type': 'Application/json',
	},
})

// Универсальная функция для обработки запросов
async function handleRequest(request, isCategoryList = false) {
	try {
		const response = await request()
		// Возвращаем либо список категорий, либо продукты в зависимости от типа запроса
		return isCategoryList ? response.data : response.data.products
	} catch (error) {
		console.error('API request error:', error)
		throw error
	}
}

export const fetchCategories = () => {
	return handleRequest(() => apiClient.get('/category-list'), true)
}

export const fetchProducts = () => {
	return handleRequest(() => apiClient.get('/'))
}

export const fetchProductsByCategory = category => {
	return handleRequest(() => apiClient.get(`/category/${category}`))
}

export const fetchProductsBySearch = query => {
	return handleRequest(() => apiClient.get('/search', { params: { q: query } }))
}

export default {
	fetchCategories,
	fetchProducts,
	fetchProductsByCategory,
	fetchProductsBySearch,
}
