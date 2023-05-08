import { PrismaClient } from "@prisma/client";
import appError from "../utils/appError.js";
const prisma = new PrismaClient();
import validator from "../utils/validation.js";

const adminModel = {
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
};

export { adminModel };
