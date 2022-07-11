<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  disabled?: boolean;
  icon: string;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
}>();

const classnames = computed((): string =>
  props.disabled ? "!text-gray-400 !bg-gray-200" : ""
);
</script>

<template>
  <button
    class="flex items-center justify-center rounded-full p-2 hover:shadow-xl transition aspect-square"
    :class="classnames"
    :disabled="disabled"
  >
    <Icon :type="icon" :class="size ? `text-${size}` : ''" />
  </button>
</template>
