import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cookies } from "react-cookie";

type AuthStore = {
  accessToken: string | null;
  refreshToken: string | null;
  user: any;
  //   clearTokens:()=>
  setCredentials: (access: string, refresh: string) => void;
  clearTokens: () => void;
  setUser: (user: any) => void;
  logout: () => void;
  rehydrate: () => void;
};
const cookies = new Cookies();
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // states
      accessToken: null,
      refreshToken: null,
      user: null,

      //actions
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
      setCredentials: (access, refresh) =>
        set({ accessToken: access, refreshToken: refresh }),
      setUser: (user) => set({ user }),
      logout: () => {
        cookies.remove("accessToken");
        cookies.remove("refreshToken");
        set({ accessToken: null, refreshToken: null });
      },
      rehydrate: async () => {
        const accessToken = cookies.get("accessToken");
        const refreshToken = cookies.get("refreshToken");

        if (accessToken && refreshToken) {
          set({ accessToken, refreshToken });
        }
      },
    }),

    {
      // config for persistence
      name: "auth-storage",
      partialize: (state) => ({
        // Specify which parts of the state to persist
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
