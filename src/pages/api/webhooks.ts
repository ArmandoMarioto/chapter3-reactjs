import { NextApiRequest, NextApiResponse } from "next";

export default (req:NextApiRequest, res:NextApiResponse) => {
    console.log('evento recebido: ', req.body);
    res.status(200).json({ok: true});

}