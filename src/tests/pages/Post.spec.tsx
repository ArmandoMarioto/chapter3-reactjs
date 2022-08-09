import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "first-post",
  title: "First Post",
  content: "<p>First Post Excerpt</p>",
  updatedAt: "10 de Abril de 2020",
};

jest.mock("../../services/prismic");
jest.mock("next-auth/react");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);
    expect(screen.getByText("First Post")).toBeInTheDocument();
    expect(screen.getByText("First Post Excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockReturnValueOnce({
      activeSubscription: null,
    } as any);
    const response = await getServerSideProps({
      params: {
        slug: "first-post",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
    }),

    it("loads initial data", async () => {
      const getSessionMocked = jest.mocked(getSession);
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
      getSessionMocked.mockReturnValueOnce({
        activeSubscription: 'fake-active-subscription',
      } as any);



      const response = await getServerSideProps({
        params: {
          slug: "first-post",
        },
      } as any);
  
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
