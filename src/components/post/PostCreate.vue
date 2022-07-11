<script setup lang="ts">
import { useTeamStore } from "@/stores/team";
import { ref } from "vue";
import { helpers, required } from "@vuelidate/validators";
import { ERROR_MSG } from "@/constantes/errorMsg";
import useVuelidate from "@vuelidate/core";
import { errorHelper } from "@/helpers/errorHelper";
import { eventBus } from "@/services/eventBus";

const teamStore = useTeamStore();

const state = ref({
  content: "",
});
const rules = {
  content: {
    required: helpers.withMessage(ERROR_MSG.required, required),
  },
};
const v$ = useVuelidate(rules, state);

async function submit(): Promise<void> {
  if (!teamStore.team) return;
  try {
    await teamStore.addPost(teamStore.team.id, state.value.content);
    state.value.content = "";
  } catch (e) {
    eventBus.$emit("show-snackbar", {
      text: errorHelper.formatMessage(e),
      type: "error",
    });
  }
}
</script>

<template>
  <div class="flex items-center gap-4">
    <Input
      label="Ajouter un article"
      class="flex-1"
      v-model:value="state.content"
      @blur="v$.content.$touch()"
    />
    <ButtonIcon
      class="bg-primary text-primary-contrast"
      :disabled="v$.$invalid"
      @click="submit"
      icon="add"
    />
  </div>
</template>
