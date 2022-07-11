import { NextApiRequest, NextApiResponse } from "next";
import { Readable} from 'stream'
import Stripe from "stripe";
import { stripe } from "../../services/stripe";


async function buffer(readable: Readable){
    const chunks: Buffer[] = []
    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
            )
    }
    return Buffer.concat(chunks)
}

export const config ={
    api: {
        bodyParser: false
    }
}
const RelevantEvents = new Set([
    'checkout.session.completed'

])
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
    const buf = await buffer(req);
    const secret = req.headers["x-stripe-signature"];
    let event: Stripe.Event;
    try {
    event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    const type = event.type;
    if (RelevantEvents.has(type)) {
        console.log(`Webhook received: ${event}`);
    }
    res.status(200).end();
    }else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
