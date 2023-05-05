import { PrismaClient } from "@prisma/client";
import appError from "../utils/appError.js";
const prisma = new PrismaClient();

const adminModel = {
  createLottery: async (
    event_name,
    event_start_time,
    event_end_time,
    create_time,
    event_data,
    last_update_time
  ) => {
    let result = null;
    try {
      // 建立一個新的資料庫交易
      await prisma.$transaction(async (tx) => {
        // 將活動資訊新增至 `event` 資料表中
        const event = await tx.event.create({
          data: {
            event_name,
            event_start_time,
            event_end_time,
            create_time,
            last_update_time,
          },
        });

        // 將每個折扣資訊新增至 `discount` 資料表中，並且設定對應的活動 ID
        const discounts = event_data.map(async (item) => {
          const discount = await tx.discount.create({
            data: {
              event_id: event.event_id,
              discount_name: item.discount_name,
              discount_value: item.discount_value,
              threshold: item.threshold,
              inventory: item.inventory,
            },
          });
          return discount;
        });
        // 將新增的活動資訊和折扣資訊回傳
        result = {
          event_id: event.event_id,
          event_name: event.event_name,
          event_start_time: event.event_start_time.toISOString(),
          event_end_time: event.event_end_time.toISOString(),
          is_visible: event.is_visible,
          status: event.status,
          create_time: event.create_time.toISOString(),
          last_update_time: event.last_update_time.toISOString(),
          event_data: discounts,
        };
      });
    } catch (err) {
      console.error(err);
      throw new Error("Failed to create lottery event");
    }
    return result;
  },
  getLottery: async (page, pageSize) => {
    if (page === 999) {
        const result = await prisma.event.findMany({
                include: {
                    Discount: true,
                },
            }
        );
        return result;
    }
    else {
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