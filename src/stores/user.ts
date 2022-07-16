import { defineStore } from "pinia";
import { ApiConsumer } from "@/services/ApiConsumer";
import type { User, UserInvitation, UserMembership } from "@/stores/storeTypes";

interface StoreUser extends User {
  membership: UserMembership[];
  invitations: UserInvitation[];
}

type UserRootState = {
  user: StoreUser | null;
};

export const useUserStore = defineStore({
  id: "user",
  state: () =>
    ({
      user: null,
    } as UserRootState),
  getters: {
    isLogged: (state) => state.user !== null,
  },
  actions: {
    async refreshUser() {
      const user = (await ApiConsumer.get("user/self")) as StoreUser;
      this.user = user;
    },
    async autoLogin() {
      if (this.user) return;
      try {
        if (localStorage.getItem("token")) {
          ApiConsumer.setToken(localStorage.getItem("token") || "");
          const user = (await ApiConsumer.get("user/self")) as StoreUser;
          this.user = user;
        }
      } catch (e) {
        this.user = null;
        ApiConsumer.removeToken();
        throw e;
      }
    },
    async login(email: string, password: string) {
      const data = (await ApiConsumer.post("user/login", {
        email,
        password,
      })) as { user: StoreUser; token: string };
      this.user = data.user;
      ApiConsumer.setToken(data.token);
    },
    async register(name: string, email: string, password: string) {
      const data = (await ApiConsumer.post("user/register", {
        name,
        email,
        password,
      })) as { user: StoreUser; token: string };
      this.user = data.user;
      ApiConsumer.setToken(data.token);
    },
    logout() {
      this.user = null;
      ApiConsumer.removeToken();
    },
    addTeam(membership: UserMembership) {
      if (this.user) {
        const memberships = this.user.membership;
        memberships.push(membership);
        this.user.membership = memberships;
      }
    },
    updateMembership(membership: UserMembership) {
      if (this.user) {
        const memberships = this.user.membership.filter(
          (elem) => elem.id !== membership.id
        );
        memberships.push(membership);
        this.user.membership = memberships;
      }
    },
  },
});
