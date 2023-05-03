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
  createInfo: async (member_id, discount_id, coupon, next) => {
    try{
      const result_1 = await prisma.info.create({
        data:{
          member_id: parseInt(member_id),
          discount_id: parseInt(discount_id),
          coupon: coupon,
          }
      });
      const result_2 = await prisma.discount.findUnique({
        where:{
          discount_id: parseInt(result_1.discount_id)
        }
      });
      return {result_1, result_2}
    } catch (err) {
        console.log(err)
        if(err.code === 'P2003' || err.code === 'P2002')
          throw next(appError(200, `輸入值不符合規定`, "100", next));
    }
  }
};

export { eventsModel };
