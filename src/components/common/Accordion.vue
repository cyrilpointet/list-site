<script setup lang="ts">
import { ref, onUpdated, onMounted, nextTick } from "vue";
import { eventBus } from "@/services/eventBus";

const props = defineProps<{
  title: string;
  number?: number;
}>();

const maxHeight = ref<string | null>(null);
const panel = ref<HTMLDivElement | null>(null);

function toggle() {
  if (maxHeight.value === null) {
    maxHeight.value = panel.value?.scrollHeight + "px" || null;
  } else {
    maxHeight.value = null;
  }
}

eventBus.$on("update-accordion", () => {
  nextTick(() => {
    if (maxHeight.value !== null) {
      maxHeight.value = panel.value?.scrollHeight + "px" || null;
    } else {
      maxHeight.value = null;
    }
  });
});
</script>

<template>
  <div class="shadow">
    <button
      @click="toggle"
      class="w-full flex text-left bg-primary p-2 font-bold items-center justify-between rounded-t-lg"
      :class="{ 'rounded-b-lg': !maxHeight }"
    >
      <div class="text-primary-contrast">
        <Badge :value="number">
          {{ props.title }}
        </Badge>
      </div>
      <Icon
        type="expand_more"
        :class="{ 'rotate-180': maxHeight }"
        class="text-3xl text-primary-contrast transition-all"
      />
    </button>
    <div
      class="transition-all overflow-hidden max-h-0 bg-white rounded-b-lg"
      ref="panel"
      :style="{ maxHeight: maxHeight }"
    >
      <slot />
    </div>
  </div>
</template>
