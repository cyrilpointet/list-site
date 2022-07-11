<script setup lang="ts">
import { useTeamStore } from "../stores/team";
import { ref } from "vue";
import TeamEdit from "@/components/team/TeamEdit.vue";
import TeamDelete from "@/components/team/TeamDelete.vue";
import Posts from "@/components/team/Posts.vue";
import PostCreate from "@/components/post/PostCreate.vue";
import Members from "@/components/member/Members.vue";
import FindMember from "@/components/member/FindMember.vue";

const teamStore = useTeamStore();

const showSetting = ref(false);
</script>

<template>
  <div
    class="container mx-auto mt-6 px-4 md:px-0 flex-1 flex flex-col gap-6 overflow-hidden"
  >
    <div class="flex justify-between md:justify-start items-center gap-8">
      <div
        class="flex items-center justify-center gap-4 bg-white rounded shadow py-2 px-6"
      >
        <h1 class="text-center text-2xl font-bold mx-6">
          {{ teamStore.team?.name }}
        </h1>
      </div>
      <ButtonIcon
        class="bg-primary text-primary-contrast shadow"
        @click="showSetting = !showSetting"
        :icon="showSetting ? 'list' : 'settings'"
      />
    </div>

    <template v-if="!showSetting">
      <Card>
        <PostCreate />
      </Card>
      <Card class="mb-6 overflow-auto">
        <Posts class="-m-4" />
      </Card>
    </template>

    <div
      v-else-if="teamStore.team"
      class="grid gap-4 grid-cols-1 lg:grid-cols-2"
    >
      <div>
        <Accordion title="Partager">
          <div class="p-3">
            <FindMember />
          </div>
        </Accordion>
      </div>

      <div>
        <Accordion
          :title="
            teamStore.isUserManager ? 'Gérer les partages' : 'Liste de membres'
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
    </div>
  </div>
</template>
