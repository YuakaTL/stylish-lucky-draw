import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const eventsModel = {
  getEventDetail: async (id) => {
    const result = await prisma.event.findUnique({
      where: {
        event_id: parseInt(id),
      },
    });
    return result;
  },
};

export { eventsModel };
