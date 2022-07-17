<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import type { TeamInvitation, UserInvitation } from "@/stores/storeTypes";
import { ApiConsumer } from "@/services/ApiConsumer";
import { eventBus } from "@/services/eventBus";
import { errorHelper } from "@/helpers/errorHelper";
import router from "@/router";
import { useTeamStore } from "@/stores/team";

const userStore = useUserStore();
const teamStore = useTeamStore();

const loading = ref(false);

async function validate(invitation: TeamInvitation) {
  loading.value = true;
  try {
    await ApiConsumer.put(`invitation/${invitation.id}`);
    eventBus.$emit("show-snackbar", {
      text: `la demande de ${invitation.user.name} a bien été acceptée`,
    });
    await teamStore.refreshTeam();
  } catch (e) {
    eventBus.$emit("show-snackbar", {
      text: errorHelper.formatMessage(e),
      type: "error",
    });
    loading.value = false;
  }
}

async function reject(invitation: TeamInvitation) {
  loading.value = true;
  try {
    await ApiConsumer.delete(`invitation/${invitation.id}`);
    eventBus.$emit("show-snackbar", {
      text: `la demande de ${invitation.user.name} a bien été rejetée`,
    });
    await teamStore.refreshTeam();
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
    v-for="invitation in teamStore.team.invitations"
    :key="invitation.id"
    class="p-4 flex justify-between items-center gap-4 cursor-pointer transition border-b last:border-0"
  >
    <p class="flex-1">{{ invitation.user.name }}</p>
    <ButtonIcon
      class="bg-primary text-primary-contrast"
      icon="person_add"
      :loading="loading"
      @click="validate(invitation)"
    />
    <ButtonIcon
      class="bg-primary text-primary-contrast"
      icon="delete"
      :loading="loading"
      @click="reject(invitation)"
    />
  </div>
</template>
