// import { create } from 'zustand';

// const useAuthStore = create((set) => ({
//   user: null,
//   isLoggedIn: false,

//   login: (userData) => set({ user: userData, isLoggedIn: true }),

//   logout: () => set({ user: null, isLoggedIn: false }),
// }));

// export default useAuthStore;


// src/authStore.js



import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // key in localStorage
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
