import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TeamsCards from "@/components/teams/teams-cards";
import { Team } from "@prisma/client";
import { useRouter } from "next/router";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  Users: () => <div data-testid="mock-users">Users Icon</div>,
  Clock: () => <div data-testid="mock-clock">Clock Icon</div>,
  ArrowRight: () => <div data-testid="mock-arrow-right">Arrow Right Icon</div>,
}));

// Mock Card components
jest.mock("@/components/ui/card", () => ({
  Card: jest.fn(({ children }: any) => (
    <div data-testid="mock-card" role="article">
      {children}
    </div>
  )),
  CardHeader: jest.fn(({ children }: any) => (
    <div data-testid="mock-card-header">{children}</div>
  )),
  CardTitle: jest.fn(({ children }: any) => (
    <div data-testid="mock-card-title">{children}</div>
  )),
  CardContent: jest.fn(({ children }: any) => (
    <div data-testid="mock-card-content">{children}</div>
  )),
}));

// Mock Button component
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="mock-button" {...props}>
      {children}
    </button>
  ),
}));

// Mock DeleteTeamDialog component
jest.mock("@/components/teams/delete-team-dialog", () => ({
  DeleteTeamDialog: ({ teamId, teamName }: any) => (
    <div data-testid={`mock-delete-dialog-${teamId}`}>
      Delete Dialog for {teamName}
    </div>
  ),
}));

describe("TeamsCards", () => {
  const mockTeams: Team[] = [
    {
      id: "1",
      name: "Team Alpha",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      archived: false,
    },
    {
      id: "2",
      name: "Team Beta",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      archived: false,
    },
  ];

  it("renders the correct number of team cards", () => {
    render(<TeamsCards teams={mockTeams} />);

    const cards = screen.getAllByTestId("mock-card");
    expect(cards).toHaveLength(2);
  });

  it("displays team information correctly", () => {
    render(<TeamsCards teams={mockTeams} />);

    // Check first team
    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    expect(screen.getByText("Created Jan 1, 2024")).toBeInTheDocument();

    // Check second team
    expect(screen.getByText("Team Beta")).toBeInTheDocument();
    expect(screen.getByText("Created Feb 1, 2024")).toBeInTheDocument();
  });

  it("renders delete dialog for each team", () => {
    render(<TeamsCards teams={mockTeams} />);

    expect(screen.getByTestId("mock-delete-dialog-1")).toBeInTheDocument();
    expect(screen.getByTestId("mock-delete-dialog-2")).toBeInTheDocument();
  });

  it("renders select button for each team", () => {
    render(<TeamsCards teams={mockTeams} />);

    const buttons = screen.getAllByTestId("mock-button");
    expect(buttons).toHaveLength(2);
    buttons.forEach((button) => {
      expect(button).toHaveTextContent("Select");
    });
  });

  it("shows 'No Teams Found' message when teams array is empty", () => {
    render(<TeamsCards teams={[]} />);

    // Check the card content
    const card = screen.getByTestId("mock-card");
    expect(card).toBeInTheDocument();

    // Check the title and content
    const cardTitle = screen.getByTestId("mock-card-title");
    expect(cardTitle).toHaveTextContent("No Teams Found");

    const cardContent = screen.getByTestId("mock-card-content");
    expect(cardContent).toHaveTextContent(
      "Create a team to get started with collaboration"
    );
  });

  it("shows 'No Teams Found' message when teams is null", () => {
    render(<TeamsCards teams={[]} />);

    // Check the card content
    const card = screen.getByTestId("mock-card");
    expect(card).toBeInTheDocument();

    // Check the title and content
    const cardTitle = screen.getByTestId("mock-card-title");
    expect(cardTitle).toHaveTextContent("No Teams Found");

    const cardContent = screen.getByTestId("mock-card-content");
    expect(cardContent).toHaveTextContent(
      "Create a team to get started with collaboration"
    );
  });
});
