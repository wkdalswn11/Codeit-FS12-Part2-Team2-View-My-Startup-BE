import { PrismaClient } from "@prisma/client";
import { validateNameAndEmail } from "../utils/userValidation.js";

const prisma = new PrismaClient();

export const addUserService = async (body) => {
  const { name, email } = validateNameAndEmail(body.name, body.email);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error("이미 존재하는 이메일입니다.");
    error.status = 409;
    throw error;
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const loginUserService = async (body) => {
  const { name, email } = validateNameAndEmail(body.name, body.email);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.name !== name) {
    const error = new Error("이름 또는 이메일이 일치하지 않습니다.");
    error.status = 401;
    throw error;
  }

  return {
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
