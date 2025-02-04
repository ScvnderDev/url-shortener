import { SignCardProps } from "@/interfaces";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/hooks/useAuth";

const schema = z
  .object({
    email: z.string().email(),
    fullName: z.string().min(6).max(50),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
type FormField = z.infer<typeof schema>;

const Register = ({ setState }: SignCardProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormField>({ resolver: zodResolver(schema), mode: "onChange" });

  const { mutate: registerUser, isPending } = useRegister();

  const onSubmit: SubmitHandler<FormField> = async (data) => {
    console.log("🥝[data]:", data);
    try {
      registerUser(data, {
        onSuccess: async () => {
          setState("login");
        },
      });
    } catch (error) {
      setError("email", {
        type: "manual",
        message: "This email is already taken",
      });
    }
  };
  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>Use you E-mail</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("email")} placeholder="E-mail" type="text" />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
          <Input {...register("fullName")} placeholder="John doe" type="text" />
          {errors.fullName && (
            <p className="text-red-500 text-xs">{errors.fullName.message}</p>
          )}
          <Input
            {...register("password")}
            placeholder="Password"
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
          <Input
            {...register("confirmPassword")}
            placeholder="Confirm password"
            type="password"
          />
          {errors.confirmPassword && (
            <p className="text-xs  text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
          <Button type="submit" className="w-full" size={"lg"}>
            {isPending ? "Loading..." : "Submit"}
          </Button>

          <p className="text-xs text-muted-foreground">
            You already have an account ?
            <span
              className="text-sky-700 hover:underline cursor-pointer"
              onClick={() => setState("login")}
            >
              Sign in
            </span>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default Register;
