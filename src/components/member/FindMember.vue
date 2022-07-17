<script setup lang="ts">
import { ref } from "vue";
import { helpers, required } from "@vuelidate/validators";
import { ERROR_MSG } from "@/constantes/errorMsg";
import useVuelidate from "@vuelidate/core";
import { ApiConsumer } from "@/services/ApiConsumer";
import { errorHelper } from "@/helpers/errorHelper";
import type { User } from "@/stores/storeTypes";
import { eventBus } from "@/services/eventBus";
import { useTeamStore } from "@/stores/team";

const loading = ref(false);
const users = ref<null | User[]>(null);

const teamStore = useTeamStore();

const state = ref({
  name: "",
});
const rules = {
  name: {
    required: helpers.withMessage(ERROR_MSG.required, required),
  },
};
const v$ = useVuelidate(rules, state);

async function submit() {
  if (v$.value.$invalid) return;
  loading.value = true;
  users.value = null;
  try {
    const usersFound = (await ApiConsumer.get(
      `user?filter={"name":"${state.value.name}","email":"${state.value.name}"}`
    )) as User[];
    users.value = usersFound;
    eventBus.$emit("update-accordion");
  } catch (e) {
    eventBus.$emit("show-snackbar", {
      text: errorHelper.formatMessage(e),
      type: "error",
    });
  }
  loading.value = false;
}

function belongsToTeam(user: User) {
  return !!teamStore.team?.members.find((elem) => elem.user.id === user.id);
}

const userToAdd = ref<null | User>(null);
function closeModal() {
  userToAdd.value = null;
}

async function inviteUser() {
  if (!teamStore.team || !userToAdd.value) return;
  loading.value = true;
  try {
    await ApiConsumer.post("invitation/user", {
      teamId: teamStore.team.id,
      email: userToAdd.value.email,
    });
    eventBus.$emit("update-accordion");
    eventBus.$emit("show-snackbar", {
      text: `Une invitation a été envoyée à ${userToAdd.value.name}`,
    });
  } catch (e) {
    eventBus.$emit("show-snackbar", {
      text: errorHelper.formatMessage(e),
      type: "error",
    });
  }
  closeModal();
  loading.value = false;
}
</script>

<template>
  <div class="flex items-center gap-4">
    <Input
      label="Chercher un membre"
      class="flex-1"
      v-model:value="state.name"
      @blur="v$.name.$touch()"
      placeholder="Nom ou email"
      @keyup.enter="submit"
    />
    <ButtonIcon
      class="bg-primary text-primary-contrast"
      :disabled="v$.$invalid || loading"
      @click="submit"
      icon="search"
    />
  </div>
  <div v-if="users !== null" class="mt-4">
    <div
      v-if="users.length === 0"
      class="px-4 py-2 flex items-center border-b last:border-0"
    >
      <p class="flex-1">Aucun membre trouvé</p>
    </div>
    <div
      v-for="user in users"
      :key="user.id"
      class="px-4 py-2 flex items-center border-b last:border-0"
    >
      <p class="flex-1">
        {{ user.name }}
      </p>
      <ButtonIcon
        v-if="!belongsToTeam(user)"
        class="bg-primary text-primary-contrast"
        :disabled="loading"
        @click="userToAdd = user"
        icon="person_add"
      />
    </div>
  </div>

  <Modal :onClose="closeModal" :isOpen="userToAdd">
    <div class="w-64">
      <p>Inviter {{ userToAdd?.name }} à partager cette liste ?</p>
      <div class="mt-6 flex justify-between">
        <Button @click="closeModal">Annuler</Button>
        <Button @click="inviteUser()">Valider</Button>
      </div>
    </div>
  </Modal>
</template>
