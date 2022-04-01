import { PrismaClient } from '@prisma/client';
import type { NextApiRequest as Req, NextApiResponse as Res } from 'next'
import { getSession } from 'next-auth/react';
import { response, sumPrices } from '../../utils';
import { ProductTransaction } from '../../utils/Interfaces';

const prisma = new PrismaClient();

export default function handler(req: Req, res: Res) {
    switch (req.method) {
        case 'POST':
            return setTransaction(req, res);
        default:
            return response(res, null, 'Invalid HTTP method', 405);
    }
}

async function setTransaction(req: Req, res: Res) {
    try {
        const session = await getSession({ req });

        const createdBy = session?.user?.email as string;

        const transaction: ProductTransaction[] = req.body.transaction;

        const prices = transaction.map(({ price, qty }) => price * qty);

        const amount = sumPrices(...prices);

        const description = JSON.stringify(transaction.map(({ name, price, qty }) => ({ name, price, qty })));

        for (const item of transaction) {
            const product = await prisma.product.findUnique({ where: { id: item.id } });

            if (!product) {
                return response(res, null, `Product ${item.id} doesn't exist`, 404);
            }

            if (product && product.quantity < item.qty) {
                return response(res, null, `Insuficent items of ${item.name}`, 400);
            }

            const newQty = product?.quantity - item.qty;
            await prisma.product.update({
                where: { id: item.id },
                data: { quantity: newQty }
            });
        }

        await prisma.transaction.create({
            data: {
                amount,
                createdBy,
                description,
            }
        });
        response(res, amount);
    } catch (error) {
        console.error(error);
        response(res, null, 'Something went wrong', 500);
    }


}