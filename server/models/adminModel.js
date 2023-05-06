import { PrismaClient } from "@prisma/client";
import appError from "../utils/appError.js";
const prisma = new PrismaClient();

const adminModel = {
  getLottery: async (page, pageSize) => {
    if (pageSize === 999) {
      const result = await prisma.event.findMany({
        include: {
          Discount: true,
        },
      });
      return result;
    } else {
      const result = await prisma.event.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize + 1,
        include: {
          Discount: true,
        },
      });
      return result;
    }
  },
};

export { adminModel };
