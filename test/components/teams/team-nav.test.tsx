import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeamNav } from "@/components/teams/team-nav";
import { useRouter } from "next/router";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  LayoutDashboard: () => <div data-testid="mock-dashboard">Dashboard Icon</div>,
  Users: () => <div data-testid="mock-users">Users Icon</div>,
  History: () => <div data-testid="mock-history">History Icon</div>,
  Settings: () => <div data-testid="mock-settings">Settings Icon</div>,
  X: () => <div data-testid="mock-x">X Icon</div>,
}));

// Mock Radix UI Tabs
const mockPush = jest.fn();
let currentValue = "boards";

jest.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children, value, onValueChange }: any) => {
    currentValue = value;
    return (
      <div
        data-testid="mock-tabs"
        data-value={value}
        onClick={() => onValueChange("members")}
      >
        {children}
      </div>
    );
  },
  TabsList: ({ children }: any) => (
    <div data-testid="mock-tabs-list">{children}</div>
  ),
  TabsTrigger: ({ children, value }: any) => (
    <button
      data-testid={`mock-tab-${value}`}
      role="tab"
      data-state={value === currentValue ? "active" : "inactive"}
      onClick={() => value === "members" && mockPush(`/teams/123/${value}`)}
    >
      {children}
    </button>
  ),
}));

// Mock Dialog component
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: any) => (
    <div data-testid="mock-dialog">{children}</div>
  ),
  DialogContent: ({ children }: any) => (
    <div data-testid="mock-dialog-content">
      {children}
      <button data-testid="mock-dialog-close">
        <div data-testid="mock-x" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  ),
  DialogTrigger: ({ children }: any) => (
    <div data-testid="mock-dialog-trigger">{children}</div>
  ),
}));

describe("TeamNav", () => {
  const mockRouter = {
    push: jest.fn(),
    isReady: true,
    asPath: "/teams/123/boards",
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockRouter.push.mockClear();
    mockPush.mockClear();
    currentValue = "boards";
  });

  it("renders all navigation items with correct icons", () => {
    render(<TeamNav teamId="123" />);

    // Check if all navigation items are present
    const navItems = [
      { value: "boards", label: "Boards" },
      { value: "members", label: "Members" },
      { value: "history", label: "History" },
      { value: "settings", label: "Settings" },
    ];

    navItems.forEach((item) => {
      const tab = screen.getByTestId(`mock-tab-${item.value}`);
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveAttribute("role", "tab");
    });

    // Check if all icons are present
    expect(screen.getByTestId("mock-dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("mock-users")).toBeInTheDocument();
    expect(screen.getByTestId("mock-history")).toBeInTheDocument();
    expect(screen.getByTestId("mock-settings")).toBeInTheDocument();
  });

  it("sets the correct active tab based on the current route", () => {
    render(<TeamNav teamId="123" />);

    // The active tab should be "boards" based on the mock router path
    const boardsTab = screen.getByTestId("mock-tab-boards");
    expect(boardsTab).toHaveAttribute("data-state", "active");
  });

  it("navigates to the correct route when a tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TeamNav teamId="123" />);

    // Click on the Members tab
    const membersTab = screen.getByTestId("mock-tab-members");
    await user.click(membersTab);

    // Verify that router.push was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith("/teams/123/members");
  });

  it("uses the default tab when no matching route is found", () => {
    // Mock a path that doesn't match any tab
    (useRouter as jest.Mock).mockReturnValue({
      ...mockRouter,
      asPath: "/teams/123/unknown",
    });

    render(<TeamNav teamId="123" defaultTab="members" />);

    // The active tab should be the default tab (members)
    const membersTab = screen.getByTestId("mock-tab-members");
    expect(membersTab).toHaveAttribute("data-state", "active");
  });
});
