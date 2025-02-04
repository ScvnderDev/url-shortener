import { Link2, Settings } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
// import { useAuthStore } from "@/stores/auth.store";
const SettingsModal = lazy(() => import("./SettingsModal"));

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  // const { user } = useAuthStore.getState();
  // console.log("🍎[user]:", user);

  return (
    <header
      className="bg-base-100 border-b border-base-300  w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">data</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={toggleModal}
              className={`
              btn btn-sm gap-2 transition-colors
              
              `}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* Lazy Load Modal */}
      {isModalOpen && (
        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center">
              Loading...
            </div>
          }
        >
          <SettingsModal />
        </Suspense>
      )}
    </header>
  );
};

export default Navbar;
