<script setup lang="ts">
import { useTeamStore } from "@/stores/team";
import { ref } from "vue";
import { errorHelper } from "@/helpers/errorHelper";
import { eventBus } from "@/services/eventBus";

const teamStore = useTeamStore();

const loading = ref(false);

async function deletePost(postId: number) {
  loading.value = true;
  try {
    await teamStore.deletePost(postId);
  } catch (e) {
    eventBus.$emit("show-snackbar", {
      text: errorHelper.formatMessage(e),
      type: "error",
    });
  }
  loading.value = false;
}
</script>

<template>
  <div>
    <div v-if="teamStore.team.posts.length < 1" class="px-4 py-2">
      Liste vide
    </div>
    <div
      v-for="post in teamStore.team.posts"
      :key="post.id"
      class="px-4 py-2 flex justify-between items-center cursor-pointer border-b last:border-0 hover:bg-gray-100 hover:shadow transition"
    >
      <p>{{ post.content }}</p>
      <ButtonIcon
        @click.stop="deletePost(post.id)"
        icon="delete"
        class="text-error hover:bg-gray-100"
        :disabled="loading"
      />
    </div>
  </div>
</template>
