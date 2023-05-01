import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const usersModel = {
  singUp: async (data) => {
    const result = await prisma.user.create({
      data,
    });
    return result;
  },
  signIn: async (email) => {
    const result = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return result;
  },
  getProfile: async (id) => {
    const result = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return result;
  },
};

export { usersModel };
