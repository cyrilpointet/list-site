<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  onClose: () => void;
  disableBgClick?: boolean;
}>();

function handleBgClick() {
  if (!props.disableBgClick) {
    props.onClose();
  }
}
</script>

<template>
  <Transition name="fade">
    <div
      class="fixed inset-0 flex items-center justify-center"
      style="background-color: rgba(0, 0, 0, 0.5)"
      @click="handleBgClick"
      v-if="isOpen"
    >
      <div
        class="bg-white p-4 pt-6 relative shadow"
        style="min-width: 220px; max-width: 90vw; max-height: 90vh"
        @click.stop
      >
        <slot></slot>
        <button
          @click="onClose"
          class="absolute top-1 right-1 flex items-center justify-center"
        >
          <Icon type="close" />
        </button>
      </div>
    </div>
  </Transition>
</template>
