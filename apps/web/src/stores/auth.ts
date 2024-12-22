import { create } from "zustand";

type AuthStore = {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
}));
