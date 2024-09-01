import { useState } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { schemaRoom } from "@/lib/schemas/room.schema";
import { validateFormData } from "@/lib/utils/validation";
import { createRoomAction } from "@/lib/actions";

type FormData = {
  name: string;
};

type Errors = {
  name?: string;
};

export default function CreateRoomForm({ setIsModalOpen }) {
  const router = useRouter();
  const session = useSession();
  const [formData, setFormData] = useState<FormData>({ name: "" });

  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("name", e.target.value);
    console.log("formdata", formData);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log("formdata", formData);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors, data } = validateFormData(schemaRoom, formData);
    if (errors) {
      setErrors(errors);
    } else {
      setErrors({});
      createRoomAction(data, session.data?.user?.email ?? "").then((room) => {
        console.log(room);
        if (room === null) {
          console.error("Error creating room");
          return;
        }
        router.push(`/room/${room._id}`);
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <form onSubmit={handleSubmit} className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Create Room
          </h3>
          <div className="mt-2">
            <input
              id="name"
              name="name"
              onChange={handleChange}
              value={formData.name}
              type="text"
              placeholder="Room Name"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.name && (
              <p style={{ color: "red", marginTop: "4px" }}>{errors.name}</p>
            )}
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
