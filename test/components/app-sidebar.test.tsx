import { render, screen } from "@testing-library/react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const mockIsMobile = jest.fn(() => false);
jest.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => mockIsMobile(),
}));

jest.mock("lucide-react", () => ({
  Inbox: () => <div data-testid="mock-inbox">Inbox Icon</div>,
  Users: () => <div data-testid="mock-users">Users Icon</div>,
  Files: () => <div data-testid="mock-files">Files Icon</div>,
  GitPullRequest: () => <div data-testid="mock-git">Git Icon</div>,
  LogOut: () => <div data-testid="mock-logout">Logout Icon</div>,
  ChevronRight: () => <div data-testid="mock-chevron">Chevron Icon</div>,
  Bell: () => <div data-testid="mock-bell">Bell Icon</div>,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <SidebarProvider>{children}</SidebarProvider>;
};

describe("AppSidebar", () => {
  beforeEach(() => {
    mockIsMobile.mockImplementation(() => false);
  });

  it("renders without crashing", () => {
    render(
      <TestWrapper>
        <AppSidebar />
      </TestWrapper>
    );

    const heading = screen.getByRole("heading", { name: "Collaboard" });
    expect(heading).toBeInTheDocument();

    const teamsLink = screen.getByRole("link", { name: /Your Teams/i });
    expect(teamsLink).toBeInTheDocument();
  });

  it("displays all main navigation items", () => {
    render(
      <TestWrapper>
        <AppSidebar />
      </TestWrapper>
    );

    const links = ["Your Teams", "Team Invitations", "Notifications"];

    links.forEach((linkText) => {
      const link = screen.getByRole("link", {
        name: new RegExp(linkText, "i"),
      });
      expect(link).toBeInTheDocument();
    });
  });

  it("displays sign out button", () => {
    render(
      <TestWrapper>
        <AppSidebar />
      </TestWrapper>
    );

    const signOutButton = screen.getByRole("button", { name: /Sign Out/i });
    expect(signOutButton).toBeInTheDocument();
  });
});
