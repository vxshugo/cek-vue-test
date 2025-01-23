import { ref } from 'vue'
import {
	fetchCategories,
	fetchProducts
} from '@/services/apiService'

export function useProductStore() {
	const categories = ref([])
	const selectedCategory = ref(null)
	const products = ref([])
	const searchQuery = ref('')
	const isLoading = ref(false)
	const errorMessage = ref('')
	const limit = 20
	const offset = ref(0)

	// Универсальная функция загрузки продуктов
	async function loadProducts({ title = null, categoryId = null, resetOffset = false }) {
		isLoading.value = true;
		errorMessage.value = "";
		if (resetOffset) offset.value = 0; // Сбрасываем offset, если это необходимо

		try {
			const params = {
				...(title && { title }),
				...(categoryId && { categoryId }),
				offset: offset.value,
				limit,
			};
			const response = await fetchProducts(params);
			if (response.length) {
				products.value = resetOffset ? response : [...products.value, ...response];
				offset.value += response.length;
			} else {
				if (resetOffset) {
					// Нет товаров при начальной загрузке с установленными фильтрами
					throw new Error('No products found');
				} else {
					// Нет дополнительных товаров при попытке подгрузки
					throw new Error('No more products found with the current filters');
				}
			}
		} catch (error) {
			errorMessage.value = error.message || 'Failed to load products.';
			console.error('Load Products Error:', error);
		} finally {
			isLoading.value = false;
		}
	}


	// Загрузка только категорий
	async function loadCategories() {
		isLoading.value = true;
		try {
			categories.value = await fetchCategories();
		} catch (error) {
			errorMessage.value = 'Failed to load categories.';
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
	}
}
