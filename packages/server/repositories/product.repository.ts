import { prisma } from '../lib/prisma.ts';

export const productRepository = {
  getProductById: async (productId: number) => {
    return prisma.product.findUnique({
      where: { id: productId },
    });
  },
};
