<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import type { UserInvitation } from "@/stores/storeTypes";
import { ApiConsumer } from "@/services/ApiConsumer";
import { eventBus } from "@/services/eventBus";
import { errorHelper } from "@/helpers/errorHelper";
import router from "@/router";

const userStore = useUserStore();

const loading = ref(false);

async function join(invitation: UserInvitation) {
  loading.value = true;
  try {
    await ApiConsumer.put(`invitation/${invitation.id}`);
    userStore.refreshUser();
    router.push(`/team/${invitation.team.id}`);
  } catch (e) {
    eventBus.$emit("show-snackbar", {
      text: errorHelper.formatMessage(e),
      type: "error",
    });
    loading.value = false;
  }
}

async function reject(invitation: UserInvitation) {
  loading.value = true;
  try {
    await ApiConsumer.delete(`invitation/${invitation.id}`);
    eventBus.$emit("show-snackbar", {
      text: `la demande de ${invitation.team.name} a bien été rejetée`,
    });
    userStore.refreshUser();
  } catch (e) {
    eventBus.$emit("show-snackbar", {
      text: errorHelper.formatMessage(e),
      type: "error",
    });
    loading.value = false;
  }
}
</script>

<template>
  <div
    v-for="invitation in userStore.user.invitations"
    :key="invitation.id"
    class="p-4 flex justify-between items-center gap-4 cursor-pointer transition border-b last:border-0"
  >
    <p class="flex-1">{{ invitation.team.name }}</p>
    <ButtonIcon
      class="bg-primary text-primary-contrast"
      icon="person_add"
      :loading="loading"
      @click="join(invitation)"
    />
    <ButtonIcon
      class="bg-primary text-primary-contrast"
      icon="delete"
      :loading="loading"
      @click="reject(invitation)"
    />
  </div>
</template>
