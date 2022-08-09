import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react';
import Home,{ getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';



jest.mock("next-auth/react",() => {
    return { 
        useSession: jest.fn().mockReturnValueOnce({
            data: null,
            status: "unauthenticated"
          })
    }
});
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
    }),
  }))

  jest.mock('../../services/stripe');


describe('Home page', () => {
    it('renders correctly', () => {
        render(<Home product={{priceId: 'fake-price', amount: 'R$10,00'}}/>)

        expect(screen.getByText('for R$10,00 month')).toBeInTheDocument()
    })

    it('loads initial data', async () => {
        const retriveStripePricesMocked = jest.mocked(stripe.prices.retrieve);
        retriveStripePricesMocked.mockResolvedValueOnce({
            id: 'fake-price',
            unit_amount: 1000,

        }as any)

        const response = await getStaticProps({});
        //expect(response.props.product.priceId).toBe('fake-price');
        //expect(response.props.product.amount).toBe('$10,00');
        expect(response).toEqual(
            expect.objectContaining({
                props: expect.objectContaining({
                    product: expect.objectContaining({
                        priceId: 'fake-price',
                        amount: '$10.00'
                    })
                })
            })
        )

    })
})