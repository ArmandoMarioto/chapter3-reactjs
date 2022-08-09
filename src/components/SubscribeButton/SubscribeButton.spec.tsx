import { render, screen, fireEvent } from "@testing-library/react";


import { SubscribeButton } from ".";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

jest.mock("next-auth/react");
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
  }))

describe("SubscribeButton Component", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
        data: null,
        status: "unauthenticated"
      })
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
  });

  it("redirects user to sign in when not autheticated", () => {
    const signInMocked = jest.mocked(signIn);
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
        data: null,
        status: "unauthenticated"
      })

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalledWith("github");
  });

  it("redirects to posts when user already has a subscription", () => {
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn();
    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'John Doe',
          email: 'johndoe@example.com'
        },
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires'
      },
      status: "authenticated"
    })
    useRouterMocked.mockReturnValueOnce({
        push: pushMock
    } as any);

    render(<SubscribeButton />);
    const subscribeButton = screen.getByText("Subscribe Now");

    fireEvent.click(subscribeButton);
    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
