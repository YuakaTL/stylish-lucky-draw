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
};

export { eventsModel };
