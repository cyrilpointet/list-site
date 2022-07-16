import { defineStore } from "pinia";
import { ApiConsumer } from "@/services/ApiConsumer";
import { useUserStore } from "@/stores/user";
import type { Team, TeamMember, UserMembership } from "@/stores/storeTypes";

type Post = {
  content: string;
  id: string;
};

interface StoreTeam extends Team {
  posts: Post[];
  members: TeamMember[];
}

type TeamRootState = {
  team: StoreTeam | null;
};

export const useTeamStore = defineStore({
  id: "team",
  state: () =>
    ({
      team: null,
    } as TeamRootState),
  getters: {
    isUserManager: (state) => {
      const userStore = useUserStore();
      const membership = state.team?.members.find(
        (elem) => elem.user.id === userStore.user?.id
      );
      return !!membership?.manager;
    },
    userMembership: (state) => {
      const userStore = useUserStore();
      return state.team?.members.find(
        (elem) => elem.user.id === userStore.user?.id
      );
    },
  },
  actions: {
    async createTeam(name: string) {
      const team = (await ApiConsumer.post("team", {
        name,
      })) as StoreTeam;
      this.team = team;
      const firstMember = team.members[0];
      const userStore = useUserStore();
      userStore.addTeam({
        id: firstMember.id,
        manager: firstMember.manager,
        createdAt: firstMember.createdAt,
        updatedAt: firstMember.createdAt,
        team: {
          id: team.id,
          name: team.name,
          createdAt: team.createdAt,
          updatedAt: team.createdAt,
        },
      });
      return team.id;
    },
    async getTeam(id: string) {
      const team = (await ApiConsumer.get(`team/${id}`)) as StoreTeam;
      this.team = team;
    },
    async updateTeam(values: { name: string }) {
      if (!this.team) return;
      const newTeam = (await ApiConsumer.put(`team/${this.team.id}`, {
        name: values.name,
      })) as StoreTeam;
      this.team = newTeam;
      const userStore = useUserStore();
      if (userStore.user) {
        const updatedMembership = userStore.user.membership.find(
          (elem) => elem.team.id === newTeam.id
        );
        const memberships = userStore.user.membership.filter(
          (elem) => elem.team.id !== newTeam.id
        );
        if (updatedMembership) {
          updatedMembership.team = {
            id: newTeam.id,
            name: newTeam.name,
            createdAt: newTeam.createdAt,
            updatedAt: newTeam.createdAt,
          };
          memberships.push(updatedMembership);
        }
        userStore.user.membership = memberships;
      }
    },
    async deleteTeam(teamId: string) {
      await ApiConsumer.delete(`team/${teamId}`);
      this.team = null;
      const userStore = useUserStore();
      if (userStore.user) {
        const membership = userStore.user.membership.filter(
          (elem) => elem.team.id !== teamId
        );
        userStore.user.membership = membership;
      }
    },

    async addPost(teamId: string, content: string) {
      if (!this.team) return;
      const newPost = (await ApiConsumer.post("post/", {
        content,
        teamId,
      })) as Post;
      this.team.posts.push(newPost);
    },
    async deletePost(postId: string) {
      if (!this.team) return;
      await ApiConsumer.delete(`post/${postId}`);
      const posts = this.team.posts.filter((post) => post.id !== postId);
      this.team.posts = posts;
    },

    async setMemberManager(member: TeamMember) {
      if (!this.team) return;
      const newMember = await ApiConsumer.put(`member/${member.id}`, {
        manager: !member.manager,
      });
      const members = this.team.members.filter((elem) => elem.id !== member.id);
      members.push(newMember as TeamMember);
      this.team.members = members;
      const userStore = useUserStore();
      if (userStore.user?.id === member.id) {
        userStore.updateMembership(newMember as UserMembership);
      }
    },
    async addMember(teamId: string, userId: string) {
      if (!this.team) return;
      const newMember = (await ApiConsumer.post("member/", {
        userId,
        teamId,
      })) as TeamMember;
      this.team.members.push(newMember);
    },
    async deleteMember(memberId: string) {
      if (!this.team) return;
      await ApiConsumer.delete(`member/${memberId}`);
      const members = this.team.members.filter(
        (member) => member.id !== memberId
      );
      this.team.members = members;
    },
  },
});
