<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import router from "@/router";

const userStore = useUserStore();

function logout() {
  router.push("/");
  userStore.logout();
}
</script>

<template>
  <div v-if="userStore.isLogged" class="container mx-auto px-4 md:px-0">
    <Card class="mt-6">
      <h1 class="text-3xl font-bold text-center my-6">
        Hello {{ userStore.user.name }}!
      </h1>
      <div class="flex justify-center mt-8">
        <Button @click="logout">Déconnexion</Button>
      </div>
    </Card>
  </div>
</template>
