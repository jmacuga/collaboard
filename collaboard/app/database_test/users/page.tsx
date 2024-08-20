import UsersList from "@/app/ui/users/usersList";
import CreateUserButton from "@/app/ui/users/createUserButton";

export default function Page() {
  return (
    <>
      <div>
        <p>Users page</p>
        <UsersList />
        <CreateUserButton />
      </div>
    </>
  );
}
