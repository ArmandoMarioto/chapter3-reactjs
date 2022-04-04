import { NextApiRequest, NextApiResponse } from "next"
export default (request: NextApiRequest, response: NextApiResponse) => {
    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'jo@gmail.com'
        },
        {
            id: 2,
            name: 'Doe Joe',
            email: 'doe@gmail'
        },
        {
            id: 3,
            name: 'Juju Doe',
            email: 'juju@gmail'
        },
    ]

    response.status(200).json(users);
}