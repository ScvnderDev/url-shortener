import { useLogout } from "@/hooks/useAuth";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";

const SettingsModal = () => {
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };
  return (
    <Card>
      <CardHeader>
        <Button onClick={handleLogout}>Logout</Button>
      </CardHeader>
    </Card>
  );
};

export default SettingsModal;
