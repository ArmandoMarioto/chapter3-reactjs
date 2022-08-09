import { render, screen } from '@testing-library/react'
import Posts,{ getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

const posts = [
    { 
        slug: 'first-post',
        title: 'First Post',
        excerpt: 'First Post Excerpt',
        updatedAt: '10 de Abril de 2020',

    }
]


jest.mock('../../services/prismic')

describe('Home page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts}/>)
        expect(screen.getByText('First Post')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient);
        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'first-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'First Post' }
                            ],
                            content: [
                                { type: 'paragraph', text: 'First Post Excerpt' }
                            ],
                        },
                        last_publication_date: '2020-04-10T00:00:00.000Z',
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({});

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'first-post',
                        title: 'First Post',
                        excerpt: 'First Post Excerpt',
                        updatedAt: '09 de abril de 2020',
                    }]
                }
            })
        )
    })

})