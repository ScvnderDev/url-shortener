import { Users } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={true}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          {/* <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span> */}
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3"></div>
    </aside>
  );
};

export default Sidebar;
