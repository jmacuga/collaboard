import Link from "next/link";
import {
  HomeIcon,
  UserIcon,
  CogIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "@/auth";

export default function SideNav() {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        My App
      </div>
      <nav className="mt-4">
        <ul>
          <li className="flex items-center p-4 hover:bg-gray-700">
            <HomeIcon className="h-6 w-6 mr-2" />
            <span>Home</span>
          </li>
          <li className="flex items-center p-4 hover:bg-gray-700">
            <UserIcon className="h-6 w-6 mr-2" />
            <span>Profile</span>
          </li>
          <li className="flex items-center p-4 hover:bg-gray-700">
            <CogIcon className="h-6 w-6 mr-2" />
            <span>Settings</span>
          </li>
          <li className="p-4 hover:bg-gray-700">
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
