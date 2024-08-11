import { fetchAllUsers } from "@/lib/data";

interface User {
  _id: string;
  email: string;
}

export default async function Page() {
  const users: User[] = await fetchAllUsers();
  console.log(users);
  return (
    <div>
      {users.map((user: User) => (
        <div key={user._id}>{user.email}</div>
      ))}
      <p>Users page</p>
    </div>
  );
}
