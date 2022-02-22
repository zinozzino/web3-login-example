import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';
import * as yup from 'yup';

import prisma from '~/prisma';
import getRandom from '~/utils/getRandom';

const schema = yup.object().shape({
  address: yup.string().required(),
});

const Api: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({});
    return;
  }

  const { id: userId } = session.user;

  switch (req.method) {
    case 'GET': {
      const wallets = await prisma.wallet.findMany({
        select: { id: true, address: true },
        where: { userId },
      });

      res.status(200).json({
        wallets,
      });
      return;
    }
    case 'POST': {
      try {
        const { address } = await schema.validate(req.body);

        const wallet = await prisma.wallet.create({
          data: {
            address,
            userId,
            nonce: getRandom(),
          },
          select: { address: true, id: true },
        });

        res.status(201).json({ ...wallet });
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const { name, errors } = err as yup.ValidationError;

          res.status(400).json({ name, errors });
        } else {
          /* eslint-disable-next-line no-console */
          console.log(err);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      }

      return;
    }
    default:
      res.status(200).json({});
  }
};

export default Api;
