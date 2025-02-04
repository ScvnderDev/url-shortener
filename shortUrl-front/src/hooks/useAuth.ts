import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { useAuthStore } from "../stores/auth.store";
import { ILoginCredentials } from "@/interfaces/login.interface";

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: any) => {
      console.log("🍐[formData]:", formData);
      const { data } = await axiosInstance.post("/user", formData);
      return data;
    },
    onSuccess: async (data) => {
      console.log("🦑[data]:", data);
      await queryClient.refetchQueries({ queryKey: ["userRegister"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: ILoginCredentials) => {
      const { data } = await axiosInstance.post("/auth/login", credentials);

      return data;
    },
    onSuccess: (data) => {
      useAuthStore
        .getState()
        .setCredentials(data.accessToken, data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      const { data } = await axiosInstance.post("/auth/refresh", {
        refreshToken,
      });

      return data;
    },
    onSuccess: (data) => {
      useAuthStore
        .getState()
        .setCredentials(data.accessToken, data.refreshToken);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },
    onSuccess: () => {
      useAuthStore.getState().logout();
      queryClient.clear();
    },
  });
};

export const useUser = () => {
  // This ensures the hook re-renders when accessToken changes.
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      console.log("🍪 accessToken:", accessToken);
      const { data } = await axiosInstance.get("/user/user-info");
      console.log("🥃 user data:", data);
      // Optionally, update your store with the user data.
      useAuthStore.getState().setUser(data);
      return data;
    },
    // The query will only run if accessToken is truthy.
    enabled: !!accessToken,
  });
};
