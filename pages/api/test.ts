import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (process.env.NODE_ENV !== 'production') {
        res.json({ cookie: req.headers.cookie })
    }
    res.json({});
}


