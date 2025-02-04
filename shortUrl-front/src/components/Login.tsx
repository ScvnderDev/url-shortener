import { SignCardProps } from "@/interfaces";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/useAuth";
import { ILoginCredentials } from "@/interfaces/login.interface";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";
import { axiosInstance } from "@/api/axios";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters").max(20),
});

type FormField = z.infer<typeof schema>;

const Login = ({ setState }: SignCardProps) => {
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<FormField>({ resolver: zodResolver(schema), mode: "onChange" });
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate(); // Hook to handle navigation

  const onSubmit: SubmitHandler<FormField> = async (
    data: ILoginCredentials
  ) => {
    try {
      login(data, {
        onSuccess: async (responseData) => {
          // Set tokens in the auth store.
          useAuthStore
            .getState()
            .setCredentials(
              responseData.accessToken,
              responseData.refreshToken
            );

          // Log tokens to verify they are correctly set.
          const { accessToken, refreshToken } = useAuthStore.getState();

          if (accessToken && refreshToken) {
            navigate("/auth");
          }
          const data = await axiosInstance.get("/user/user-info");
          
          useAuthStore.getState().setUser(data.data);
          // Navigate to the target page.
          navigate("/");
        },
      });
    } catch (error) {
      
    }
  };
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Login to continue</CardTitle>
        <CardDescription>Use your E-mail</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("email")} placeholder="E-mail" type="email" />
          {errors.email && (
            <p className="text-xs  text-red-500">{errors.email.message}</p>
          )}

          <Input
            {...register("password")}
            placeholder="Password"
            type="password"
          />
          {errors.password && (
            <p className="text-xs  text-red-500">{errors.password.message}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting && isPending ? "Loading..." : "Submit"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <span
              className="text-sky-700 hover:underline cursor-pointer"
              onClick={() => setState("register")}
            >
              Sign up
            </span>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;
