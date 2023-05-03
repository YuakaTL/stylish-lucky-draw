import { PrismaClient } from "@prisma/client";

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

  updateInventory: async (discountId, increase) => {
    // if increase is true then increase inventory
    const increment = increase ? 1 : -1;
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
  },
};

export { eventsModel };
