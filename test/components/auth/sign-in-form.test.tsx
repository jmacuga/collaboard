import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "@/components/auth/sign-in-form";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import * as React from "react";
import { signIn } from "next-auth/react";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@heroicons/react/24/outline", () => ({
  AtSymbolIcon: () => <div data-testid="mock-at-icon" />,
  KeyIcon: () => <div data-testid="mock-key-icon" />,
  ExclamationCircleIcon: () => <div data-testid="mock-error-icon" />,
}));

jest.mock("@heroicons/react/20/solid", () => ({
  ArrowRightIcon: () => <div data-testid="mock-arrow-icon" />,
}));

const mockSetLoading = jest.fn();
jest.mock("react", () => {
  const originalModule = jest.requireActual("react");

  return {
    ...originalModule,
    useState: jest.fn((initialState) => {
      if (initialState === false) {
        return [false, mockSetLoading];
      }
      return originalModule.useState(initialState);
    }),
  };
});

// Mock react-hook-form
const mockHandleSubmit = jest.fn((fn) => (e: React.FormEvent) => {
  e.preventDefault();
  fn({ email: "test@example.com", password: "Password123!" });
});

const mockFormState = {
  isSubmitting: false,
  errors: {},
};

jest.mock("react-hook-form", () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: mockHandleSubmit,
    formState: mockFormState,
    control: {},
    setValue: jest.fn(),
  }),
}));

jest.mock("@hookform/resolvers/zod", () => ({
  zodResolver: jest.fn(() => jest.fn()),
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

describe("SignInForm", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (signIn as jest.Mock).mockClear();
  });

  it("renders the sign in form with email and password fields", () => {
    render(<SignInForm />);

    expect(screen.getByText("Please sign in to continue.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("handles successful sign in", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true, error: null });

    render(<SignInForm />);

    const user = userEvent.setup();
    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "Password123!");

    const signInButton = screen.getByText("Sign in");
    await user.click(signInButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "Password123!",
        redirect: false,
        callbackUrl: "/teams",
      });
      expect(toast.success).toHaveBeenCalledWith("Sign in successful!");
      expect(mockRouter.push).toHaveBeenCalledWith("/teams");
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  it("handles failed sign in with invalid credentials", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      error: "Invalid credentials",
    });

    render(<SignInForm />);

    const user = userEvent.setup();
    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "InvalidPassword");

    const signInButton = screen.getByText("Sign in");
    await user.click(signInButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Invalid email or password");
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });

  it("handles sign in error", async () => {
    const mockError = new Error("Network error");
    (signIn as jest.Mock).mockRejectedValueOnce(mockError);

    render(<SignInForm />);

    const user = userEvent.setup();
    const emailInput = screen.getByLabelText("Email");
    await user.type(emailInput, "test@example.com");

    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "Password123!");

    const signInButton = screen.getByText("Sign in");
    await user.click(signInButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Network error");
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });

  it("shows loading state during sign in process", async () => {
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, mockSetLoading]);

    render(<SignInForm />);

    expect(screen.getByText("Signing in...")).toBeInTheDocument();
    const button = screen.getByTestId("mock-button");
    expect(button).toBeDisabled();
  });

  it("shows validation errors for invalid inputs", async () => {
    const mockErrorFormState = {
      errors: {
        email: {
          message: "Invalid email format",
        },
        password: {
          message: "Password is required",
        },
      },
    };

    Object.defineProperty(mockFormState, "errors", {
      value: mockErrorFormState.errors,
      configurable: true,
    });

    render(<SignInForm />);

    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });
});
