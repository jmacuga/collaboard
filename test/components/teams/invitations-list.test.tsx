import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InvitationsList } from "@/components/teams/invitations-list";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { TeamInvitationStatus } from "@prisma/client";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

global.fetch = jest.fn();

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="mock-card">{children}</div>,
  CardHeader: ({ children }: any) => (
    <div data-testid="mock-card-header">{children}</div>
  ),
  CardTitle: ({ children }: any) => (
    <div data-testid="mock-card-title">{children}</div>
  ),
  CardDescription: ({ children }: any) => (
    <div data-testid="mock-card-description">{children}</div>
  ),
  CardContent: ({ children }: any) => (
    <div data-testid="mock-card-content">{children}</div>
  ),
  CardFooter: ({ children }: any) => (
    <div data-testid="mock-card-footer">{children}</div>
  ),
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="mock-button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock("lucide-react", () => ({
  Loader2: () => <div data-testid="mock-loader">Loading...</div>,
}));
describe("InvitationsList", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (global.fetch as jest.Mock).mockClear();
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
    mockRouter.push.mockClear();
  });

  const mockInvitations = [
    {
      id: "1",
      status: TeamInvitationStatus.PENDING,
      teamId: "team1",
      hostId: "host1",
      email: "user@example.com",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      team: { name: "Team Alpha" },
      host: { name: "John Doe", email: "john@example.com" },
    },
    {
      id: "2",
      status: TeamInvitationStatus.PENDING,
      teamId: "team2",
      hostId: "host2",
      email: "user@example.com",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-02-01"),
      team: { name: "Team Beta" },
      host: { name: "Jane Smith", email: "jane@example.com" },
    },
  ];

  it("renders 'No pending invitations' message when there are no invitations", () => {
    render(<InvitationsList invitations={[]} />);
    expect(screen.getByText("No pending invitations")).toBeInTheDocument();
  });

  it("renders the correct number of invitation cards", () => {
    render(<InvitationsList invitations={mockInvitations} />);
    const cards = screen.getAllByTestId("mock-card");
    expect(cards).toHaveLength(2);
  });

  it("displays team and host information correctly", () => {
    render(<InvitationsList invitations={mockInvitations} />);

    expect(screen.getByText("Team Alpha")).toBeInTheDocument();
    expect(screen.getByText("Invited by John Doe")).toBeInTheDocument();
    expect(screen.getByText("Received on 1/1/2024")).toBeInTheDocument();

    expect(screen.getByText("Team Beta")).toBeInTheDocument();
    expect(screen.getByText("Invited by Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Received on 2/1/2024")).toBeInTheDocument();
  });

  it("renders accept and reject buttons for each invitation", () => {
    render(<InvitationsList invitations={mockInvitations} />);

    const buttons = screen.getAllByTestId("mock-button");
    expect(buttons).toHaveLength(4); // 2 invitations × 2 buttons each

    // Check button text
    expect(screen.getAllByText("Accept")).toHaveLength(2);
    expect(screen.getAllByText("Reject")).toHaveLength(2);
  });

  it("handles successful invitation acceptance", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<InvitationsList invitations={mockInvitations} />);

    const acceptButtons = screen.getAllByText("Accept");
    await userEvent.click(acceptButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/invitations/1/accept",
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Invitation accepted successfully"
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/profile/invitations");
    });
  });

  it("handles successful invitation rejection", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<InvitationsList invitations={mockInvitations} />);

    const rejectButtons = screen.getAllByText("Reject");
    await userEvent.click(rejectButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/invitations/1/reject",
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Invitation rejected successfully"
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/profile/invitations");
    });
  });

  it("handles failed invitation action", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Failed to accept invitation" }),
    });

    render(<InvitationsList invitations={mockInvitations} />);

    const acceptButtons = screen.getAllByText("Accept");
    await userEvent.click(acceptButtons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to accept invitation");
    });
  });

  it("disables buttons while processing", async () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<InvitationsList invitations={mockInvitations} />);

    const acceptButton = screen.getAllByText("Accept")[0];
    await userEvent.click(acceptButton);

    expect(acceptButton).toBeDisabled();
    const loaders = screen.getAllByTestId("mock-loader");
    expect(loaders[0]).toBeInTheDocument();
  });
});
