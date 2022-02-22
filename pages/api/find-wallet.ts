import { NextApiHandler } from 'next';
import * as yup from 'yup';

import prisma from '~/prisma';

const schema = yup.object().shape({
  address: yup.string().required(),
});

const Api: NextApiHandler = async (req, res) => {
  let address: string;

  try {
    const validated = await schema.validate(req.query);

    address = validated.address;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const { name, errors } = err;
      res.status(400).json({ name, errors });
    }

    return;
  }

  const wallet = await prisma.wallet.findFirst({
    select: { address: true, nonce: true },
    where: { address },
  });

  if (!wallet) {
    res.status(404).json({});
    return;
  }

  res.status(200).json({ ...wallet });
};

export default Api;
