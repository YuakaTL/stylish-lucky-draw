import { PrismaClient, Prisma } from "@prisma/client";
import validator from "../utils/validation.js";
const prisma = new PrismaClient();

const adminModel = {
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
      // use [] for storing return value
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
};

export { adminModel };
