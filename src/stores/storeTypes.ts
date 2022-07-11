export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  manager: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember extends Membership {
  user: User;
}

export interface UserMembership extends Membership {
  team: Team;
}
