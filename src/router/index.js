import { createRouter, createWebHistory } from 'vue-router'
import Products from '../components/Products.vue'
import ProductDetails from '../components/ProductDetails.vue' // Компонент, который мы создадим для деталей продукта

const routes = [
	{
		path: '/',
		name: 'Products',
		component: Products,
	},
	{
		path: '/product/:id', // Путь для страницы с деталями продукта
		name: 'ProductDetails',
		component: ProductDetails,
		props: true, // Включаем передачу параметров как пропсов
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
