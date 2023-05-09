import { PrismaClient, Prisma } from "@prisma/client";
import validator from "../utils/validation.js";
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
  updateLottery: async (
    event_id,
    event_name,
    start_time,
    end_time,
    is_visible,
    status,
    event_data,
    next
  ) => {
    let result = null;
    // new a transaction
    await prisma.$transaction(async (tx) => {
      const event = await tx.event.update({
        where: { event_id: parseInt(event_id) },
        data: {
          event_name,
          start_time: new Date(start_time),
          end_time: new Date(end_time),
          last_update_time: new Date(),
          is_visible,
          status,
        },
      });

      await tx.discount.deleteMany({
        where: { event_id: parseInt(event_id) },
      });

      // insert new data into discount table
      const discounts = [];
      for (const item of event_data) {
        const {
          獎項名稱: discount_name,
          折扣: discount_value,
          領取條件: threshold,
          庫存張數: inventory,
        } = item;

        // error handle for excel content
        validator.existValidate(discount_name, "discount_name", next);
        validator.existValidate(discount_value, "discount_value", next);
        validator.existValidate(threshold, "threshold", next);
        validator.existValidate(inventory, "inventory", next);
        validator.rangeValidate(discount_value, "discount_value", next);
        validator.numberValidate(threshold, "inventory", next);
        validator.numberValidate(inventory, "inventory", next);

        await tx.discount.create({
          data: {
            event_id: event.event_id,
            discount_name,
            discount_value,
            threshold,
            inventory,
          },
        });

        // push every discount into discounts
        discounts.push({
          discount_name,
          discount_value,
          threshold,
          inventory,
        });
      }

      // return
      result = {
        event_id: event.event_id,
        event_name: event.event_name,
        event_start_time: event.start_time,
        event_end_time: event.end_time,
        is_visible: event.is_visible,
        status: event.status,
        create_time: event.create_time,
        last_update_time: event.last_update_time,
        event_data: discounts,
      };
    });
    return result;
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
  createLottery: async (event_name, start_time, end_time, event_data, next) => {
    let result = null;
    // new a transaction
    await prisma.$transaction(async (tx) => {
      // insert data into event table
      const event = await tx.event.create({
        data: {
          event_name,
          start_time: new Date(start_time),
          end_time: new Date(end_time),
          create_time: new Date(),
          last_update_time: new Date(),
        },
      });

      // insert data into discount table
      for (let i = 0; i < event_data.length; i++) {
        await tx.discount.create({
          data: {
            discount_name: event_data[i].discount_name,
            discount_value: event_data[i].discount_value,
            event_id: event.event_id,
            threshold: event_data[i].threshold,
            inventory: event_data[i].inventory,
          },
        });
      }

      // return
      result = {
        event_id: event.event_id,
        event_name: event.event_name,
        event_start_time: event.start_time,
        event_end_time: event.end_time,
        is_visible: event.is_visible,
        status: event.status,
        create_time: event.create_time,
        last_update_time: event.last_update_time,
        event_data,
      };
    });
    return result;
  },
};

export { adminModel };
