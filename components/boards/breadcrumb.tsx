import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Board } from "@prisma/client";
import { Team } from "@prisma/client";

export default function TeamBreadcrumb({
  team,
  board,
  item,
}: {
  team: Team;
  board?: Board;
  item?: string;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/teams">Teams</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/teams/${team.id}/boards`}>
            {team.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {board && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/boards/${board.id}`}>
                {board.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        {item && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{item}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
