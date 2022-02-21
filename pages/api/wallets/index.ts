import { Wallet } from '@prisma/client';
import { nanoid } from 'nanoid';
import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';
import * as yup from 'yup';

import prisma from '~/prisma';

const schema = yup.object().shape({
  addresses: yup.array(yup.string().required()).required(),
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
        const { addresses } = await schema.validate(req.body);

        const wallets = await Promise.allSettled(
          addresses.map(async address =>
            prisma.wallet.create({
              data: {
                address,
                userId,
                nonce: nanoid(16),
              },
              select: { address: true, id: true },
            })
          )
        );

        res.status(201).json({
          wallets: wallets
            .filter(
              (
                data
              ): data is PromiseFulfilledResult<
                Pick<Wallet, 'address' | 'id'>
              > => data.status === 'fulfilled'
            )
            .map(({ value }) => value),
        });
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const { name, errors } = err as yup.ValidationError;

          res.status(400).json({ name, errors });
        } else {
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
