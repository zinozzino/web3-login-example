import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';
import * as yup from 'yup';

import prisma from '~/prisma';

const querySchema = yup.object().shape({ id: yup.string().required() });

const Api: NextApiHandler = async (req, res) => {
  let id: string;
  const session = await getSession({ req });

  try {
    const validatedData = await querySchema.validate(req.query);
    id = validatedData.id;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const { name, errors } = err;
      res.status(400).json({ name, errors });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }

    return;
  }

  if (!session) {
    res.status(401).json({});
    return;
  }

  const { id: userId } = session.user;

  switch (req.method) {
    case 'GET': {
      const wallet = await prisma.wallet.findFirst({
        select: { address: true, id: true, nonce: true },
        where: { id },
      });

      res.status(200).json({ ...wallet });
      return;
    }
    case 'DELETE': {
      try {
        const wallet = await prisma.wallet.findFirst({
          select: { id: true },
          where: { AND: [{ userId }, { id }] },
        });

        if (wallet) {
          await prisma.wallet.delete({ where: { id } });
        }

        res.status(204).send(null);
      } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
      }

      return;
    }
    default:
      res.status(405).json({});
  }
};

export default Api;
