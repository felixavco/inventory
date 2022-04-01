import { NextApiRequest, NextApiResponse } from "next";

type messages = string |
    'OK' |
    'Unauthorized' |
    'Something went wrong' |
    'User Created' |
    'Unable to create user' |
    'Invalid HTTP method' |
    'User already exist' |
    'User not found' |
    'Insufficient privileges to perform this action' |
    'Not Found';

type statusCodes = 200 | 201 | 400 | 401 | 404 | 405 | 409 | 500;

export function response(
    res: NextApiResponse,
    data: any,
    message?: messages,
    statusCode?: statusCodes) {

    return res.status(statusCode || 200).json({
        data,
        message: message || 'OK'
    })
}

export function formatParms(req: NextApiRequest) {
    const filterBy = (req.query.filterBy as string || '').trim().toLowerCase();
    const filterValue = (req.query.filterValue as string || '').trim();
    let page = parseInt(((req.query.page as string || '1')).trim());
    let perPage = parseInt(((req.query.perPage as string || '10')).trim());
    let order = ((req.query.order as string) || 'ASC').trim().toUpperCase();

    page = page || 1;
    perPage = perPage || 10;
    const sortOrder: 'asc' | 'desc' = order === 'ASC' ? 'asc' : 'desc'

    return {
        page,
        order: sortOrder,
        perPage,
        filterBy,
        filterValue,
    }
}

export function sumPrices(...prices: number[]) {
    const total = prices.reduce((curr, prev) => curr + prev, 0);
    return parseFloat(total.toFixed(2));
}
