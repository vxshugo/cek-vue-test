<template>
	<div class="container mx-auto p-5">
		<h1 class="text-xl font-bold mb-5">{{ product.name }}</h1>
		<img :src="product.thumbnail" alt="Product Image" class="mb-5" />
		<p class="mb-5">{{ product.description }}</p>
		<p class="font-bold">Price: ${{ product.price }}</p>
		<button
			@click="goBack"
			class="mt-5 px-4 py-2 bg-blue-500 text-white rounded"
		>
			Go Back
		</button>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const product = ref({})

onMounted(async () => {
	const response = await axios.get(
		`https://dummyjson.com/products/${route.params.id}`
	)
	product.value = response.data
})

function goBack() {
	router.back() // Функция для возвращения на предыдущую страницу
}
</script>
