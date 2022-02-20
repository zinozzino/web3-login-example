import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';
import * as yup from 'yup';

import prisma from '~/prisma';

const querySchema = yup.object().shape({ id: yup.string().required() });

const Api: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({});
    return;
  }

  const { id: userId } = session.user;

  switch (req.method) {
    case 'DELETE': {
      try {
        const { id } = await querySchema.validate(req.query);

        const wallet = await prisma.wallet.findFirst({
          where: { AND: [{ userId }, { id }] },
        });

        if (wallet) {
          await prisma.wallet.delete({ where: { id } });
        }

        res.status(204).send(null);
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const { name, errors } = err;
          res.status(400).json({ name, errors });
        } else {
          res.status(500).json({ message: 'Internal Server Error' });
        }
      }

      return;
    }
    default:
      res.status(405).json({});
  }
};

export default Api;
