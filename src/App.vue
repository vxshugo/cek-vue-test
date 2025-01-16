<template>
	<div id="app">
		<Header />
		<router-view />
		<!-- Остальная часть шаблона -->
	</div>
</template>

<script setup>
import Header from './components/Header.vue' // Подключение компонента Header
import Products from './components/Products.vue'
</script>

<style>
/* Стили для App.vue */
</style>
