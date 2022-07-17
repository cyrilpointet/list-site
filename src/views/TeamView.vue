<script setup lang="ts">
import { useTeamStore } from "../stores/team";
import { ref } from "vue";
import TeamEdit from "@/components/team/TeamEdit.vue";
import TeamDelete from "@/components/team/TeamDelete.vue";
import Posts from "@/components/team/Posts.vue";
import PostCreate from "@/components/post/PostCreate.vue";
import Members from "@/components/member/Members.vue";
import FindMember from "@/components/member/FindMember.vue";
import TeamInvitations from "@/components/team/TeamInvitations.vue";
import { useUserStore } from "@/stores/user";
import router from "@/router";
import { eventBus } from "@/services/eventBus";
import { errorHelper } from "@/helpers/errorHelper";

const teamStore = useTeamStore();
const userStore = useUserStore();

const showSetting = ref(false);

const isModalOpen = ref(false);
function closeModale() {
  isModalOpen.value = false;
}
const loading = ref(false);

async function leaveTeam() {
  loading.value = true;
  if (!teamStore.userMembership?.id) return;
  try {
    await teamStore.deleteMember(teamStore.userMembership.id);
    await userStore.refreshUser();
    router.push("/");
  } catch (e) {
    eventBus.$emit("show-snackbar", {
      text: errorHelper.formatMessage(e),
      type: "error",
    });
  }
}
</script>

<template>
  <div
    class="container mx-auto pt-6 px-4 md:px-0 flex-1 flex flex-col gap-6 overflow-hidden"
  >
    <div class="flex justify-between md:justify-start items-center gap-8">
      <div
        class="flex items-center justify-center gap-4 bg-white rounded shadow py-2 px-6"
      >
        <h1 class="text-center text-2xl font-bold mx-6">
          {{ teamStore.team?.name }}
        </h1>
      </div>
      <Badge
        :value="
          teamStore.team.invitations.length > 0 && !showSetting
            ? teamStore.team.invitations.length
            : undefined
        "
      >
        <ButtonIcon
          class="bg-primary text-primary-contrast shadow"
          @click="showSetting = !showSetting"
          :icon="showSetting ? 'list' : 'settings'"
        />
      </Badge>
    </div>

    <Transition name="turn" mode="out-in">
      <div v-if="!showSetting">
        <Card>
          <PostCreate />
        </Card>
        <Card class="mb-6 overflow-auto">
          <Posts class="-m-4" />
        </Card>
      </div>

      <div
        v-else-if="teamStore.team"
        class="grid gap-4 grid-cols-1 lg:grid-cols-2"
      >
        <div
          v-if="
            teamStore.isUserManager && teamStore.team.invitations.length > 0
          "
        >
          <Accordion
            title="Demande d'adhésion en cours"
            :number="teamStore.team.invitations.length"
          >
            <div class="p-3">
              <TeamInvitations />
            </div>
          </Accordion>
        </div>
        <div v-if="teamStore.isUserManager">
          <Accordion title="Partager">
            <div class="p-3">
              <FindMember />
            </div>
          </Accordion>
        </div>

        <div>
          <Accordion
            :title="
              teamStore.isUserManager
                ? 'Gérer les partages'
                : 'Liste de membres'
            "
          >
            <div class="p-3">
              <Members />
            </div>
          </Accordion>
        </div>

        <div v-if="teamStore.isUserManager">
          <Accordion title="Renommer">
            <div class="p-3">
              <TeamEdit />
            </div>
          </Accordion>
        </div>

        <div v-if="teamStore.isUserManager">
          <Accordion title="Supprimer la liste">
            <div class="p-3">
              <TeamDelete />
            </div>
          </Accordion>
        </div>

        <div v-if="!teamStore.isUserManager">
          <Accordion title="Quitter la liste">
            <div class="p-3 flex justify-center">
              <Button @click="isModalOpen = true">Quitter la liste ?</Button>
            </div>
          </Accordion>
        </div>
      </div>
    </Transition>
  </div>

  <Modal :onClose="closeModale" :isOpen="isModalOpen">
    <div class="w-56">
      <p>Ne plus suivre cette liste ?</p>
      <div class="mt-6 flex justify-between">
        <Button @click="closeModale">Annuler</Button>
        <Button @click="leaveTeam">Valider</Button>
      </div>
    </div>
  </Modal>
</template>
