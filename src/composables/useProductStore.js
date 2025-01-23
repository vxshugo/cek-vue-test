// composables/useProductStore.js
import { ref } from 'vue'
import {
	fetchCategories,
	fetchProducts,
	fetchProductsByCategory,
	fetchProductsBySearch,
} from '@/services/apiService'

export function useProductStore() {
	const categories = ref([])
	const selectedCategory = ref('')
	const products = ref([])
	const searchQuery = ref('')
	const isLoading = ref(false)
	const errorMessage = ref('')
	const limit = 20 // Количество продуктов на страницу
	const offset = ref(0) // Начальное смещение для пагинации

	// Загрузка всех продуктов с пагинацией
	async function loadProducts() {
		isLoading.value = true
		try {
			const additionalProducts = await fetchProducts({
				offset: offset.value,
				limit,
			})
			products.value = [...products.value, ...additionalProducts]
			offset.value += additionalProducts.length // Обновляем offset после каждой загрузки
		} catch (error) {
			errorMessage.value = 'Failed to load products.'
			console.error(error)
		} finally {
			isLoading.value = false
		}
	}
	// Загрузка только категорий
	async function loadCategories() {
		isLoading.value = true
		try {
			categories.value = await fetchCategories()
		} catch (error) {
			errorMessage.value = 'Failed to load categories.'
			console.error(error)
		} finally {
			isLoading.value = false
		}
	}

	async function loadProductsByCategory(categoryId) {
		isLoading.value = true
		try {
			const response = await fetchProductsByCategory(categoryId)
			console.log('Response data:', response) // Логирование ответа сервера
			products.value = response
			if (products.value.length === 0) {
				throw new Error('No products found')
			}
		} catch (error) {
			errorMessage.value =
				error.message || 'No products found in this category.'
			console.error('Load Products By Category Error:', error)
		} finally {
			isLoading.value = false
		}
	}

	async function performSearch() {
		isLoading.value = true;
		errorMessage.value = '';
		// Сброс offset при каждом новом поиске
		offset.value = 0;

		try {
			const queryParams = {
				title: searchQuery.value,
				categoryId: selectedCategory.value ? selectedCategory.value : undefined,
				offset: offset.value,
				limit,
			};
			const results = await fetchProductsBySearch(queryParams);
			products.value = results;
			// Увеличиваем offset только если были получены результаты
			if (results.length > 0) {
				offset.value += results.length;
			}
			errorMessage.value = results.length === 0 ? 'No products found.' : '';
		} catch (error) {
			errorMessage.value = 'Error performing search.';
			console.error(error);
		} finally {
			isLoading.value = false;
		}
	}

	return {
		categories,
		selectedCategory,
		products,
		searchQuery,
		isLoading,
		errorMessage,
		loadProducts,
		loadCategories,
		loadProductsByCategory,
		performSearch,
	}
}
