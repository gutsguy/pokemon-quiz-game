const { create } = require("zustand");

export const authStore = create(set => ({
  loggedIn: false,
  user: {
    nickname: null,
    email: null,
    id: null,
  },
  setUser: user => set({ user, loggedIn: true }),
}));
