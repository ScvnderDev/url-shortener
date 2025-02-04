import { axiosInstance } from "@/api/axios";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/utils/dateFormatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  longUrl: z.string().url({ message: "Url should be valid" }),
});

type InputField = z.infer<typeof schema>;
const home = () => {
  const [expiryDate, setExpiryDate] = useState<string>(""); // State for expiryDate
  const [shortUrl, setShortUrl] = useState<string>("");
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<InputField>({ resolver: zodResolver(schema), mode: "onChange" });

  const onSubmit: SubmitHandler<InputField> = async (data) => {
    try {
      const response = await axiosInstance.post("/url", { ...data });

      const { expiryDate, shortUrl } = response.data;
      if (!expiryDate && !shortUrl) {
        console.log("invalid");
      }

      setExpiryDate(expiryDate);
      setShortUrl(shortUrl);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center mt-2">
        <div className="flex flex-col  w-1/2">
          <Input
            className="w-full"
            placeholder="Enter your URL"
            {...register("longUrl")}
          />
          {errors.longUrl && (
            <p className="text-red-500 text-xs mt-1">
              {errors.longUrl.message}
            </p>
          )}
          <Card className="w-full h-full p-8 mt-2">
            <CardHeader>
              {expiryDate ? (
                <>
                  {" "}
                  <CardTitle>
                    Expiry date: {formatDate(new Date(expiryDate))}
                  </CardTitle>
                  <CardDescription>
                    Link:
                    <a
                      className="underline"
                      href={`${shortUrl}`}
                      target="_blank"
                    >
                      {`${shortUrl}`}
                    </a>
                  </CardDescription>
                </>
              ) : (
                "Waiting"
              )}
            </CardHeader>
          </Card>
        </div>
        <Button
          className="ml-1"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting ? "Loading..." : "Convert"}
        </Button>
      </div>
    </>
  );
};

export default home;
