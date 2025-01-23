// src/services/apiService.js
import axios from 'axios'

const apiClient = axios.create({
	baseURL: 'https://api.escuelajs.co/api/v1/',
	headers: {
		'Content-Type': 'Application/json',
	},
})

// Универсальная функция для обработки запросов
async function handleRequest(request, isCategoryList = false) {
	try {
		const response = await request()
		// Возвращаем данные в зависимости от типа запроса
		return response.data
	} catch (error) {
		console.error('API request error:', error)
		throw error
	}
}

export const fetchCategories = () => {
	return handleRequest(() => apiClient.get('/categories'), true)
}

export const fetchProducts = ({ title = null, categoryId = null, offset = 0, limit = 20 }) => {
	const params = {
		...(title && { title }),
		...(categoryId && { categoryId }),
		offset,
		limit,
	};
	return handleRequest(() => apiClient.get('/products', { params }));
}

export const fetchProductsByCategory = categoryId => {
	return handleRequest(() =>
		apiClient.get(`/categories/${categoryId}/products`)
	)
}



export default {
	fetchCategories,
	fetchProducts,
	fetchProductsByCategory
}
