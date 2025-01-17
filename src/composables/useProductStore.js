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

	async function loadCategoriesAndProducts() {
		isLoading.value = true
		try {
			categories.value = await fetchCategories()
			const allProducts = await fetchProducts()
			products.value = allProducts
		} catch (error) {
			errorMessage.value = 'Failed to load categories or products.'
			console.error(error)
		} finally {
			isLoading.value = false
		}
	}

	async function loadProductsByCategory() {
		if (!selectedCategory.value) {
			const allProducts = await fetchProducts()
			products.value = allProducts
			errorMessage.value = ''
			return
		}
		isLoading.value = true
		try {
			products.value = await fetchProductsByCategory(selectedCategory.value)
			errorMessage.value =
				products.value.length === 0 ? 'No products found in this category.' : ''
		} catch (error) {
			errorMessage.value = 'Error loading products by category.'
			console.error(error)
		} finally {
			isLoading.value = false
		}
	}

	async function performSearch() {
		isLoading.value = true
		errorMessage.value = ''

		try {
			// Запрашиваем продукты по поисковому запросу без учета категории
			const searchResults = await fetchProductsBySearch(searchQuery.value)
			products.value = searchResults
			errorMessage.value =
				products.value.length === 0 ? 'No products found.' : ''
		} catch (error) {
			errorMessage.value = 'Error performing search.'
			console.error(error)
		} finally {
			isLoading.value = false
		}
	}

	return {
		categories,
		selectedCategory,
		products,
		searchQuery,
		isLoading,
		errorMessage,
		loadCategoriesAndProducts,
		loadProductsByCategory,
		performSearch,
	}
}
