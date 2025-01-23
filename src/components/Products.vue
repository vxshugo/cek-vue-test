<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useProductStore } from '@/composables/useProductStore'
import { debounce } from '@/utils/debounce'
import SearchInput from '@/components/SearchInput.vue'
import CategorySelect from '@/components/CategorySelect.vue'
import Loader from '@/components/Loader.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const {
	categories,
	selectedCategory,
	products,
	searchQuery,
	isLoading,
	errorMessage,
	loadCategories,
	loadProducts,
	loadProductsByCategory,
	performSearch,
	loadMoreProducts,
} = useProductStore()

onMounted(() => {
	loadProducts() // Загрузка продуктов
	if (categories.value.length === 0) {
		loadCategories() // Загрузка категорий, если они не загружены
	}
})

// Обеспечиваем вызов loadProductsByCategory только когда категория выбрана
watch(
	selectedCategory,
	newVal => {
		if (newVal) {
			loadProductsByCategory(newVal)
		}
	},
	{ immediate: false }
)
// Дебаунс для поиска с учетом категории
watch(
	searchQuery,
	debounce(() => {
		performSearch({
			query: searchQuery.value,
			categoryId: selectedCategory.value,
		})
	}, 500),
	{ immediate: false }
)
</script>

<template>
	<div class="bg-white">
		<div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
			<h2 class="text-2xl font-bold tracking-tight text-gray-900 mb-5">
				Products by DummyJSON API
			</h2>
			<div class="mb-4 flex justify-between">
				<SearchInput v-model="searchQuery" />
				<CategorySelect :categories="categories" v-model="selectedCategory" />
			</div>
			<Loader v-if="isLoading" />
			<ErrorMessage :message="errorMessage" />
			<div
				class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
			>
				<div
					v-for="product in products"
					:key="product.id"
					class="group relative"
				>
					<img
						:src="product.images[0]"
						:alt="product.title"
						class="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
					/>
					<div class="mt-4 flex justify-between">
						<div>
							<h3 class="text-sm text-gray-700">
								<router-link
									:to="{ name: 'ProductDetails', params: { id: product.id } }"
								>
									<span aria-hidden="true" class="absolute inset-0" />
									{{ product.title }}
								</router-link>
							</h3>
						</div>
						<p class="text-sm font-medium text-gray-900">
							${{ product.price }}
						</p>
					</div>
				</div>
			</div>

			<button @click="loadMoreProducts" class="mt-4" v-if="!isLoading">
				Загрузить еще
			</button>
		</div>
	</div>
</template>

<style>
.loader {
	border: 16px solid #f3f3f3;
	border-radius: 50%;
	border-top: 16px solid #3498db;
	width: 120px;
	height: 120px;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
