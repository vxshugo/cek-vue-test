<template>
	<Select v-model="selectedCategory">
		<SelectTrigger class="w-[180px]">
			<SelectValue placeholder="Select a category" />
		</SelectTrigger>
		<SelectContent>
			<SelectGroup>
				<SelectItem
					v-for="category in categories"
					:key="category.id"
					:value="`${category.id}`"
				>
					{{ category.name }}
				</SelectItem>
			</SelectGroup>
		</SelectContent>
	</Select>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/ui/select'

const props = defineProps({
	categories: Array,
	modelValue: String,
})

const emit = defineEmits(['update:modelValue'])

const selectedCategory = ref(props.modelValue)

watch(selectedCategory, newValue => {
	emit('update:modelValue', newValue)
})
</script>
