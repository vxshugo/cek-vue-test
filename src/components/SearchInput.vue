<template>
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
</template>

<script setup>
import { ref, watch } from 'vue'
import { Input } from '@/ui/Input'
import { Search } from 'lucide-vue-next'

const props = defineProps({
	modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref(props.modelValue)

watch(searchQuery, newValue => {
	emit('update:modelValue', newValue)
})
</script>
