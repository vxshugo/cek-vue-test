<script setup lang="ts">
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/ui/select'
import { ref, onMounted, watch } from 'vue'
import {
	fetchCategories,
	fetchProducts,
	fetchProductsBySearch,
} from '@/services/apiService'
import { Input } from '@/ui/Input'
import { Search } from 'lucide-vue-next'

const categories = ref([])
const selectedCategory = ref('')
const products = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
let searchTimeout = null

// Загрузка категорий и рандомных товаров
onMounted(async () => {
	isLoading.value = true
	try {
		// Загружаем категории
		categories.value = await fetchCategories()
		// Загружаем рандомные товары
		const allProducts = await fetchProducts()
		products.value = allProducts.sort(() => 0.5 - Math.random()).slice(0, 10)
	} catch (error) {
		errorMessage.value = 'Failed to load categories or products.'
		console.error(error)
	} finally {
		isLoading.value = false
	}
})

// Функция поиска
const performSearch = async () => {
	if (searchQuery.value.trim().length === 0) {
		// Если строка поиска пустая, показываем рандомные товары
		const allProducts = await fetchProducts()
		products.value = allProducts.sort(() => 0.5 - Math.random()).slice(0, 10)
		errorMessage.value = ''
		return
	}
	isLoading.value = true
	try {
		const searchResults = await fetchProductsBySearch(searchQuery.value)
		products.value = searchResults
		errorMessage.value = products.value.length === 0 ? 'No products found.' : ''
	} catch (error) {
		errorMessage.value = 'Error performing search.'
		console.error(error)
	} finally {
		isLoading.value = false
	}
}

// Отслеживание строки поиска с задержкой
watch(searchQuery, () => {
	clearTimeout(searchTimeout)
	searchTimeout = setTimeout(() => {
		performSearch()
	}, 500) // Задержка в 500 мс
})
</script>

<template>
	<div class="bg-white">
		<div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
			<h2 class="text-2xl font-bold tracking-tight text-gray-900 mb-5">
				Products by DummyJSON API
			</h2>
			<div class="mb-4 flex justify-between">
				<div class="relative w-full max-w-sm items-center">
					<Input
						type="text"
						v-model="searchQuery"
						placeholder="Search products..."
						class="pl-10"
					/>
					<span
						class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
					>
						<Search class="size-6 text-muted-foreground" />
					</span>
				</div>
				<Select v-model="selectedCategory">
					<SelectTrigger class="w-[180px]">
						<SelectValue placeholder="Select a category" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem
								v-for="category in categories"
								:key="category"
								:value="category"
							>
								{{ category }}
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div v-if="isLoading" class="flex justify-center items-center">
				<div class="loader"></div>
			</div>
			<div v-if="errorMessage" class="text-red-500 text-center">
				{{ errorMessage }}
			</div>
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
