import { getInvitations } from "@/db/data";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { InvitationsList } from "@/components/teams/invitations-list";

export default function Invitations({ invitations }: { invitations: string }) {
  const parsedInvitations = JSON.parse(invitations);
  return (
    <div>
      <InvitationsList invitations={parsedInvitations} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = await getSession({ req });

  if (!session?.user || !session.user.email) {
    return {
      redirect: {
        destination: "/auth/sign-in",
        permanent: false,
      },
    };
  }
  const invitations = (await getInvitations(session.user.email)) || [];
  return { props: { invitations: JSON.stringify(invitations) } };
};
