import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { useRouter } from "next/router";
import * as React from "react";
import { signUp } from "@/lib/auth/actions";

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock auth actions
jest.mock("@/lib/auth/actions", () => ({
  signUp: jest.fn(),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Import the mocked version
import toast from "react-hot-toast";

// Mock heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  AtSymbolIcon: () => <div data-testid="mock-at-icon" />,
  KeyIcon: () => <div data-testid="mock-key-icon" />,
  UserIcon: () => <div data-testid="mock-user-icon" />,
}));

jest.mock("@heroicons/react/20/solid", () => ({
  ArrowRightIcon: () => <div data-testid="mock-arrow-icon" />,
}));

// Mock useState for loading state
const mockSetLoading = jest.fn();
jest.mock("react", () => {
  const originalModule = jest.requireActual("react");

  return {
    ...originalModule,
    useState: jest.fn((initialState) => {
      if (initialState === false) {
        // This is for isLoading
        return [false, mockSetLoading];
      }
      return originalModule.useState(initialState);
    }),
  };
});

// Mock ui/button component
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

// Mock FormData
global.FormData = jest.fn().mockImplementation(() => ({
  get: jest.fn((key) => {
    if (key === "email") return "test@example.com";
    if (key === "password") return "Password123";
    if (key === "confirmPassword") return "Password123";
    if (key === "name") return "John";
    if (key === "surname") return "Doe";
    if (key === "username") return "johndoe";
    return null;
  }),
}));

describe("SignUpForm", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (signUp as jest.Mock).mockClear();
  });

  it("renders the sign up form with all required fields", () => {
    render(<SignUpForm />);

    expect(
      screen.getByRole("heading", { name: "Create an account" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Surname")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create an account/i })
    ).toBeInTheDocument();
  });

  it("handles successful sign up", async () => {
    // Mock successful signUp function
    (signUp as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<SignUpForm />);

    // Fill out the form
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "Password123");
    await user.type(screen.getByLabelText("Confirm Password"), "Password123");
    await user.type(screen.getByLabelText("Name"), "John");
    await user.type(screen.getByLabelText("Surname"), "Doe");
    await user.type(screen.getByLabelText("Username"), "johndoe");

    // Submit the form
    await user.click(
      screen.getByRole("button", { name: /create an account/i })
    );

    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith(
        "Account created successfully! Please log in."
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/auth/sign-in");
      expect(mockSetLoading).toHaveBeenCalledWith(true);
    });
  });

  it("handles sign up error from API", async () => {
    // Mock error response from signUp function
    (signUp as jest.Mock).mockResolvedValueOnce({
      error: "Email already exists",
    });

    render(<SignUpForm />);

    // Fill out the form
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "existing@example.com");
    await user.type(screen.getByLabelText("Password"), "Password123");
    await user.type(screen.getByLabelText("Confirm Password"), "Password123");
    await user.type(screen.getByLabelText("Name"), "John");
    await user.type(screen.getByLabelText("Surname"), "Doe");
    await user.type(screen.getByLabelText("Username"), "johndoe");

    // Submit the form
    await user.click(
      screen.getByRole("button", { name: /create an account/i })
    );

    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Email already exists");
      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  it("handles unexpected errors during sign up", async () => {
    // Mock rejection from signUp function
    (signUp as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<SignUpForm />);

    // Fill out the form
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "Password123");
    await user.type(screen.getByLabelText("Confirm Password"), "Password123");
    await user.type(screen.getByLabelText("Name"), "John");
    await user.type(screen.getByLabelText("Surname"), "Doe");
    await user.type(screen.getByLabelText("Username"), "johndoe");

    // Submit the form
    await user.click(
      screen.getByRole("button", { name: /create an account/i })
    );

    await waitFor(() => {
      expect(signUp).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred while creating your account"
      );
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  it("shows loading state during form submission", async () => {
    // Mock loading state
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, mockSetLoading]);

    render(<SignUpForm />);

    // Check loading state
    expect(screen.getByText("Creating account...")).toBeInTheDocument();
    const button = screen.getByTestId("mock-button");
    expect(button).toBeDisabled();
  });
});
