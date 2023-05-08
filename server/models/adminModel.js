import { PrismaClient } from "@prisma/client";
import appError from "../utils/appError.js";
const prisma = new PrismaClient();

const adminModel = {
  getRecord: async (id, paging, amount, next) => {
    if (id === undefined) {
      // infinite
      if (amount == 999) {
        const result = await prisma.info.findMany({
          include: {
            discount: {
              select: {
                discount_name: true,
                discount_value: true,
                event_id: true,
              },
            },
          },
          where: {
            is_receive: true,
          },
        });
        return { record: result };
      }
      // 10 or 50
      else {
        const result = await prisma.info.findMany({
          skip: parseInt(amount) * (parseInt(paging) - 1),
          take: parseInt(amount) + 1,
          include: {
            discount: {
              select: {
                discount_name: true,
                discount_value: true,
                event_id: true,
              },
            },
          },
          where: {
            is_receive: true,
          },
        });
        if (result.length == parseInt(amount) + 1)
          return { record: result, next_paging: parseInt(paging) + 1 };
        else return { record: result };
      }
    } else {
      // infinite
      if (amount == 999) {
        const result = await prisma.info.findMany({
          include: {
            discount: {
              select: {
                discount_name: true,
                discount_value: true,
                event_id: true,
              },
            },
          },
          where: {
            member_id: parseInt(id),
            is_receive: true,
          },
        });
        return { record: result };
      }
      // 10 or 50
      else {
        const result = await prisma.info.findMany({
          skip: parseInt(amount) * (parseInt(paging) - 1),
          take: parseInt(amount),
          include: {
            discount: {
              select: {
                discount_name: true,
                discount_value: true,
                event_id: true,
              },
            },
          },
          where: {
            member_id: parseInt(id),
            is_receive: true,
          },
        });
        if (result.length == parseInt(amount) + 1)
          return { record: result, next_paging: parseInt(paging) + 1 };
        else return { record: result };
      }
    }
  },
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
