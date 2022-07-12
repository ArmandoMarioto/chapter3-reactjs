import { fauna } from "../../../services/fauna";
import { query as q } from 'faunadb';
import { stripe } from "../../../services/stripe";

export async function saveSubscriptions(
    subscriptionID: string,
    customerID: string,
)
{
    const userRef = await fauna.query(
        q.Select(
            "ref",
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerID
            )
            )
        )
    );
    console.log(userRef);
    console.log('Cheguei aqui');
    const subscription = await stripe.subscriptions.retrieve(subscriptionID);
    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price: subscription.items.data[0].price.id
    }
    console.log(subscriptionData);
    await fauna.query(
        q.Create(
            q.Collection('subscriptions'),
            { data : subscriptionData }

        )
    )
    
}