import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateTeamDialog } from "@/components/teams/create-team-dialog";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import * as React from "react";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("lucide-react", () => ({
  X: () => <div data-testid="mock-x-icon">X</div>,
}));

const mockSetOpen = jest.fn();

jest.mock("react", () => {
  const originalModule = jest.requireActual("react");

  return {
    ...originalModule,
    useState: jest.fn((initialState) => {
      if (initialState === false) {
        return [true, mockSetOpen];
      }

      return originalModule.useState(initialState);
    }),
  };
});

const mockHandleSubmit = jest.fn((fn) => (e: React.FormEvent) => {
  e.preventDefault();
  fn({ name: "New Team" });
});
const mockReset = jest.fn();

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: mockHandleSubmit,
    formState: { isSubmitting: false, errors: {} },
    reset: mockReset,
    control: {},
    setValue: jest.fn(),
  }),
}));

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => jest.fn()),
}));

global.fetch = jest.fn();

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div
      data-testid="mock-dialog"
      data-open={open}
      onClick={() => onOpenChange && onOpenChange(!open)}
    >
      {children}
    </div>
  ),
  DialogContent: ({ children }: any) => (
    <div data-testid="mock-dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: any) => (
    <div data-testid="mock-dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: any) => (
    <div data-testid="mock-dialog-title">{children}</div>
  ),
  DialogDescription: ({ children }: any) => (
    <div data-testid="mock-dialog-description">{children}</div>
  ),
  DialogFooter: ({ children }: any) => (
    <div data-testid="mock-dialog-footer">{children}</div>
  ),
  DialogTrigger: ({ children }: any) => (
    <div data-testid="mock-dialog-trigger">{children}</div>
  ),
}));

jest.mock("@/components/ui/form", () => ({
  Form: ({ children }: any) => (
    <div data-testid="mock-form">
      {typeof children === "function" ? children() : children}
    </div>
  ),
  FormField: ({ control, name, render }: any) => {
    const field = { name, value: "New Team", onChange: jest.fn() };
    return render({ field });
  },
  FormItem: ({ children }: any) => (
    <div data-testid="mock-form-item">{children}</div>
  ),
  FormLabel: ({ children }: any) => (
    <div data-testid="mock-form-label">{children}</div>
  ),
  FormControl: ({ children }: any) => (
    <div data-testid="mock-form-control">{children}</div>
  ),
  FormMessage: ({ children }: any) => (
    <div data-testid="mock-form-message">{children}</div>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({ ...props }: any) => <input data-testid="mock-input" {...props} />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, disabled, onClick, type, ...props }: any) => (
    <button
      data-testid="mock-button"
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe("CreateTeamDialog", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders the create team button", () => {
    render(<CreateTeamDialog />);
    const createButton = screen
      .getByTestId("mock-dialog-trigger")
      .querySelector("button");
    expect(createButton).toBeInTheDocument();
  });

  it("handles successful team creation", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<CreateTeamDialog />);

    const user = userEvent.setup();
    const openButton = screen
      .getByTestId("mock-dialog-trigger")
      .querySelector("button");
    await user.click(openButton as Element);

    const input = screen.getByTestId("mock-input");
    await user.type(input, "New Team");

    const createButton = screen
      .getByTestId("mock-dialog-footer")
      .querySelector("button");
    await user.click(createButton as Element);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/teams/create",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "New Team" }),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          credentials: "include",
        })
      );
      expect(toast.success).toHaveBeenCalledWith("Team created successfully");
      expect(mockRouter.push).toHaveBeenCalledWith("/teams");
      expect(mockSetOpen).toHaveBeenCalledWith(false);
      expect(mockReset).toHaveBeenCalled();
    });
  });

  it("handles failed team creation", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<CreateTeamDialog />);

    const user = userEvent.setup();
    const openButton = screen
      .getByTestId("mock-dialog-trigger")
      .querySelector("button");
    await user.click(openButton as Element);
    const input = screen.getByTestId("mock-input");
    await user.type(input, "New Team");
    const createButton = screen
      .getByTestId("mock-dialog-footer")
      .querySelector("button");
    await user.click(createButton as Element);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Failed to create team");
    });
  });

  it("disables submit button while submitting", async () => {
    const mockFormState = { isSubmitting: true, errors: {} };

    jest.spyOn(require("react-hook-form"), "useForm").mockReturnValueOnce({
      register: jest.fn(),
      handleSubmit: jest.fn((fn) => (e: React.FormEvent) => {
        e.preventDefault();
        fn({ name: "New Team" });
      }),
      formState: mockFormState,
      reset: jest.fn(),
      control: {},
      setValue: jest.fn(),
    });

    render(<CreateTeamDialog />);

    const submitButton = screen.getByText("Creating...");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton.closest("button")).toBeDisabled();
  });
});
