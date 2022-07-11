import { createRouter, createWebHistory } from "vue-router";
import type { RouteLocationNormalized } from "vue-router";

import { useUserStore } from "@/stores/user";
import { useTeamStore } from "@/stores/team";

import HomeView from "../views/HomeView.vue";

async function autoLog(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: Function
) {
  const userStore = useUserStore();
  if (!userStore.isLogged) {
    try {
      await userStore.autoLogin();
      next();
      return;
    } catch {
      userStore.logout();
      next({ path: "/" });
      return;
    }
  } else {
    next();
  }
}

async function preloadTeam(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: Function
) {
  const teamStore = useTeamStore();
  if (teamStore.team?.id === to.params.id) {
    next();
    return;
  }
  if (typeof to.params.id === "string") {
    try {
      await teamStore.getTeam(to.params.id);
      next();
      return;
    } catch {
      next({ path: "/" });
      return;
    }
  } else {
    next({ path: "/" });
    return;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/account",
      name: "account",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AccountView.vue"),
      beforeEnter: [autoLog],
    },
    {
      path: "/team/:id",
      name: "team",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/TeamView.vue"),
      beforeEnter: [autoLog, preloadTeam],
    },
  ],
});

export default router;
