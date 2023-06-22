import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { rentalAgreementValidationSchema } from 'validationSchema/rental-agreements';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.rental_agreement
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRentalAgreementById();
    case 'PUT':
      return updateRentalAgreementById();
    case 'DELETE':
      return deleteRentalAgreementById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRentalAgreementById() {
    const data = await prisma.rental_agreement.findFirst(convertQueryToPrismaUtil(req.query, 'rental_agreement'));
    return res.status(200).json(data);
  }

  async function updateRentalAgreementById() {
    await rentalAgreementValidationSchema.validate(req.body);
    const data = await prisma.rental_agreement.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRentalAgreementById() {
    const data = await prisma.rental_agreement.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
