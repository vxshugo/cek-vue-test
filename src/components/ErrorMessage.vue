<template>
	<div v-if="message" class="text-red-500 text-center">
		{{ message }}
	</div>
</template>

<script setup>
const props = defineProps({
	message: String,
})
</script>
