<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  label?: string;
  type?: string;
  placeholder?: string;
  value: string | number;
  error?: string;
}>();

const classname = computed(() =>
  props.error ? "border-b-error" : "focus:border-b-primary"
);

function toto() {
  console.log("pouet");
}
</script>

<template>
  <label class="block">
    <span v-if="props.label" class="block text-sm">{{ props.label }}</span>
    <input
      :type="props.type || 'text'"
      :placeholder="placeholder"
      :value="props.value"
      @input="$emit('update:value', $event.target.value)"
      class="outline-0 border-b border-b-gray-400 transition w-full py-1"
      :class="classname"
      @blur="$emit('blur')"
    />
    <span v-if="props.error" class="block text-sm text-error">{{
      props.error
    }}</span>
  </label>
</template>
