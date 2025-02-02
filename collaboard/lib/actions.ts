"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    console.log("Sign in:");
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

// export async function createRoomAction(
//   formData: { name: string },
//   user_email: string
// ): Promise<IRoom | null> {
//   try {
//     const user = await getUser(user_email);
//     if (!user) {
//       console.error("Error: User not found");
//       return null;
//     }

//     const stage = await createStage([], []);
//     if (!stage) {
//       console.error("Error: Stage canvas creation failed");
//       return null;
//     }

//     const room = await createRoom({
//       name: formData.name,
//       createdBy: String(user.id),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       users: [String(user.id)],
//       stageId: stage._id as string,
//     });

//     if (!room) {
//       console.error("Error: Room creation failed");
//       return null;
//     }

//     return room;
//   } catch (error) {
//     console.error("Error creating room. Error: ", error);
//     return null;
//   }
// }
