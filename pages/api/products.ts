import { PrismaClient, Product } from '@prisma/client';
import type { NextApiRequest as Req, NextApiResponse as Res } from 'next';
import { formatParms, response } from '../../utils';

const prisma = new PrismaClient();

export default function handler(req: Req, res: Res) {
    switch (req.method) {
        case 'GET':
            return readProducts(req, res);
        default:
            return response(res, null, 'Invalid HTTP method', 405);
    }
}

async function readProducts(req: Req, res: Res) {
    const { filterBy, filterValue, page, perPage, order } = formatParms(req);

    let products: Partial<Product>[] = [];

    const select = {
        id: true,
        code: true,
        name: true,
        price: true,
        quantity: true,
    }

    try {
        switch (filterBy) {
            case 'name':
                const name = `%${filterValue.replace(' ', '')}%`;
                products = await prisma.$queryRaw<Product[]>`
                    SELECT 
                    id, 
                    code, 
                    name, 
                    price, 
                    quantity 
                    FROM products 
                    WHERE LOWER(name) LIKE LOWER(${name})
                `;
                break
            case 'code':
                const product = await prisma.product.findUnique({
                    select,
                    where: { code: filterValue },
                });

                if (product) {
                    products = [product];
                }
                break
            default:
                const offset = (perPage * page) - perPage;
                products = await prisma.product.findMany({
                    select,
                    skip: offset,
                    take: perPage,
                    orderBy: { name: order },
                })
                break;
        }

        return response(res, {
            products,
            count: products.length,
        });
    } catch (error) {
        console.error(error);
        response(res, null, 'Something went wrong', 500);
    } finally {
        await prisma.$disconnect();
    }
}


