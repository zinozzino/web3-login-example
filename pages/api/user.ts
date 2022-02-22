import { NextApiHandler } from 'next';
import { getSession } from 'next-auth/react';
import * as yup from 'yup';

import prisma from '~/prisma';

const schema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().default(''),
});

const Api: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({});
    return;
  }

  try {
    const { id } = session.user;
    const { email, name } = await schema.validate(req.body);

    if (
      await prisma.user.findFirst({ select: { id: true }, where: { email } })
    ) {
      res.status(400).json({ message: 'email already exists.' });
      return;
    }

    await prisma.user.update({
      data: {
        email,
        name,
      },
      where: {
        id,
      },
    });

    res.status(201).json({});
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const { name, errors } = err;
      res.status(400).json({ name, errors });
    } else {
      // eslint-disable-next-line no-console
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error.' });
    }

    return;
  }

  res.status(405).json({});
};

export default Api;
