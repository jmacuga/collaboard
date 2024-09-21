import {
  DocumentIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import CreateRoomButton from "./create-room-button";

export default function SideNav() {
  return (
    <div className="h-screen w-64 bg-bice-blue text-white">
      <div className="p-4 text-xl font-bold">Collaboard</div>
      <nav className="mt-4">
        <ul>
          <li className="p-4 hover:bg-blue-200 hover:cursor-pointer hover:text-oxford-blue">
            <CreateRoomButton>
              <div className="flex items-center">
                <DocumentIcon className="h-6 w-6 mr-2" />
                <span>Create New Room</span>
              </div>
            </CreateRoomButton>
          </li>

          <li className="p-4 hover:bg-blue-200 hover:cursor-pointer hover:text-oxford-blue">
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="flex items-center">
                <ArrowRightStartOnRectangleIcon className="h-6 w-6 mr-2" />
                <span>Sign Out</span>
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </div>
  );
}
