import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "first-post",
  title: "First Post",
  content: "<p>First Post Excerpt</p>",
  updatedAt: "10 de Abril de 2020",
};

jest.mock("../../services/prismic");
jest.mock("next-auth/react");
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

describe("Post Preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
        activeSubscription: "fake-active-subscription",
    } as any);
    render(<Post post={post} />);
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("First Post Excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = jest.mocked(useSession);
    const pushMock = jest.fn()
    useSessionMocked.mockReturnValueOnce({
        activeSubscription: "fake-active-subscription",
    } as any);
    const routerMocked = jest.mocked(useRouter);
    routerMocked.mockReturnValueOnce({
        push: pushMock,
    } as any);

    render(<Post post={post} />);
    expect(pushMock).toHaveBeenCalledWith("/posts/first-post");
    }),

    it("loads initial data", async () => {
      const getPrismicClientMocked = jest.mocked(getPrismicClient);
      getPrismicClientMocked.mockReturnValueOnce({
        getByUID: jest.fn().mockResolvedValueOnce({
            data: {
                title: [
                    { type: "heading", text: "First Post" }
                ],
                content: [
                    { type: "paragraph", text: "First Post Excerpt" }
                ],
            },
            last_publication_date: "2020-04-10T00:00:00.000Z",
        }),
        } as any);

      const response = await getStaticProps({
        params: {
            slug: "first-post",
        },
      })
  
      expect(response).toEqual(
        expect.objectContaining({
            props: {
                post: {
                    slug: "first-post",
                    title: "First Post",
                    content: "<p>First Post Excerpt</p>",
                    updatedAt: "09 de abril de 2020",
                }
            }
        })
      );


    });
  });
