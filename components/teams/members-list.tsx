import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@prisma/client";

interface TeamMemberWithRelations {
  id: string;
  teamId: string;
  userId: string;
  roleId: string;
  user: User;
  role: {
    id: string;
    name: string;
  };
}

export function MembersList({
  members,
}: {
  members: TeamMemberWithRelations[];
}) {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Function to get role badge color
  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case "owner":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
    }
  };

  return (
    <div className="w-full max-w-full">
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage your team members and their roles.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full max-w-full">
          <div className="w-full max-w-full overflow-auto">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/5">User</TableHead>
                  <TableHead className="w-2/5">Email</TableHead>
                  <TableHead className="w-1/5">Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${member.user.email}`}
                          alt={member.user.name}
                        />
                        <AvatarFallback>
                          {getInitials(member.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          @{member.user.username}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={getRoleBadgeColor(member.role.name)}
                        variant="outline"
                      >
                        {member.role.name}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
