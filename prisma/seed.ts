import { PrismaClient, Product } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

function* generateId(init = 1) {
    while (true) {
        yield init++;
    }
}

function createProducts(count: number = 10) {
    const units = ['unit', 'Lb', 'Lt', 'Gl'];
    const products: Partial<Product>[] = [];

    const productCode = generateId();

    for (let i = 1; i <= count; i++) {
        const customer: Partial<Product> = {
            code: `${productCode.next().value}`,
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price(0.25, 19.99)),
            quantity: parseFloat(faker.commerce.price(10, 1000)),
            unit: units[parseInt(faker.commerce.price(0, (units.length - 1)))],
        }
        products.push(customer);
    }

    return { data: products }
}

async function main() {
    const n = 7000;
    // @ts-ignore
    await prisma.product.createMany(createProducts(n));
    console.log(n, ' Products inserted to the DB');
}

main()
    .catch((error) => console.error(error))
    .finally(async () => {
        await prisma.$disconnect();
    });
