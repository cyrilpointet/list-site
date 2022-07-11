<script setup lang="ts">
import { useTeamStore } from "@/stores/team";
import { ref } from "vue";
import type { TeamMember } from "@/stores/storeTypes";
import { errorHelper } from "@/helpers/errorHelper";
import { eventBus } from "@/services/eventBus";

const teamStore = useTeamStore();

const loading = ref(false);

const memberToSetManager = ref<null | TeamMember>(null);
function closeManagerModal() {
  memberToSetManager.value = null;
}
async function setManager() {
  if (!memberToSetManager.value) return;
  loading.value = true;
  try {
    await teamStore.setMemberManager(memberToSetManager.value);
    eventBus.$emit("show-snackbar", {
      text: "Droits du membre mis à jour",
    });
  } catch (e) {
    eventBus.$emit("show-snackbar", {
      text: errorHelper.formatMessage(e),
      type: "error",
    });
  }
  memberToSetManager.value = null;
  loading.value = false;
}

const memberToBeDeleted = ref<null | TeamMember>(null);
function closeDeleteModal() {
  memberToBeDeleted.value = null;
}
async function deleteMember() {
  if (!memberToBeDeleted.value) return;
  loading.value = true;
  try {
    await teamStore.deleteMember(memberToBeDeleted.value.id);
    eventBus.$emit("show-snackbar", {
      text: "Utilisateur retiré",
    });
  } catch (e) {
    eventBus.$emit("show-snackbar", {
      text: errorHelper.formatMessage(e),
      type: "error",
    });
  }
  memberToBeDeleted.value = null;
  loading.value = false;
}
</script>

<template>
  <div
    v-for="member in teamStore.team.members"
    :key="member.id"
    class="px-4 py-2 flex items-center border-b last:border-0"
  >
    <p class="flex-1">
      {{ member.user.name }}
    </p>
    <div v-if="teamStore.isUserManager" class="flex gap-2 items center">
      <ButtonIcon
        @click.stop="memberToSetManager = member"
        icon="star"
        class="hover:bg-gray-100"
        :class="member.manager ? 'text-primary' : 'text-gray-400'"
        :disabled="loading"
      />
      <ButtonIcon
        @click.stop="memberToBeDeleted = member"
        icon="delete"
        class="text-error hover:bg-gray-100"
        :disabled="loading"
      />
    </div>
  </div>

  <Modal :onClose="closeManagerModal" :isOpen="memberToSetManager">
    <div class="w-64">
      <p>Modifier les droits de {{ memberToSetManager?.user.name }} ?</p>
      <div class="mt-6 flex justify-between">
        <Button @click="closeManagerModal">Annuler</Button>
        <Button @click="setManager(memberToSetManager)">Valider</Button>
      </div>
    </div>
  </Modal>

  <Modal :onClose="closeDeleteModal" :isOpen="memberToBeDeleted">
    <div class="w-64">
      <p>Ne plus partager avec {{ memberToBeDeleted?.user.name }} ?</p>
      <div class="mt-6 flex justify-between">
        <Button @click="closeDeleteModal">Annuler</Button>
        <Button @click="deleteMember(memberToBeDeleted)">Valider</Button>
      </div>
    </div>
  </Modal>
</template>
