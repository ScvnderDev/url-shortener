import { AuthFlow } from "@/types";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthScreen = () => {
  const [state, setState] = useState<AuthFlow>("login");
  return (
    <div className="h-screen flex items-center justify-center bg-[#5C3B58]  text-cyan-50">
      <div className="md:h-auto md:w-[420px]">
        {state === "register" ? (
          <Register setState={setState} />
        ) : (
          <Login setState={setState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
