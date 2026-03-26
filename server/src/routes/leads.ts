import { FastifyInstance } from 'fastify';
import prisma from '../lib/prisma.js';

export default async function leadRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.get('/', async (request: any) => {
    const { tenantId } = request.user;
    return prisma.lead.findMany({
      where: { tenantId },
      include: { seller: true, messages: { take: 1, orderBy: { createdAt: 'desc' } } }
    });
  });

  fastify.patch('/:id/status', async (request: any) => {
    const { id } = request.params;
    const { status } = request.body;
    const { tenantId } = request.user;

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead || lead.tenantId !== tenantId) {
      return { message: 'Não autorizado' };
    }

    return prisma.lead.update({
      where: { id },
      data: { status }
    });
  });
}
