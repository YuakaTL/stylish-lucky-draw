import { PrismaClient } from "@prisma/client";
import appError from "../utils/appError.js";
const prisma = new PrismaClient();

const eventsModel = {
  // existing method to get event details
  getEventDetail: async (id) => {
    const result = await prisma.discount.findMany({
      where: {
        event_id: parseInt(id),
      },
    });
    return result;
  },


  updateInventory: async (discountId, increase, next) => {
    // if increase is true then increase inventory
    const increment = increase ? 1 : -1;
    try {
      const result = await prisma.discount.update({
        where: {
          discount_id: parseInt(discountId),
        },
        data: {
          inventory: {
            increment,
          },
        },
        select: {
          discount_id: true,
          event_id: true,
          discount_name: true,
          inventory: true,
        },
      });
      return result;
    } catch (error) {
      // Prisma error code for missing record
      if (error.code === "P2025") {
        throw next(appError(200, `輸入值不符合規定`, "100", next));
      }
      throw next(appError(200, `系統未知錯誤`, "999", next));
    }
  },

  createInfo: async (member_id, discount_id, coupon, next) => {
    try{
      const result_info = await prisma.info.create({
        data:{
          member_id: parseInt(member_id),
          discount_id: parseInt(discount_id),
          coupon: coupon,
          }
      });
      const result_discount = await prisma.discount.findUnique({
        where:{
          discount_id: parseInt(result_info.discount_id)
        }
      });
      return {result_info, result_discount}
    } catch (err) {
        console.log(err)
        if(err.code === 'P2003' || err.code === 'P2002')
          throw next(appError(200, `輸入值不符合規定`, "100", next));
    }
  }

};

export { eventsModel };
