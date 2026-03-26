import { FastifyInstance } from 'fastify';
import prisma from '../lib/prisma.js';
import { askAI } from '../services/ai.js';
import { getNextSeller } from '../services/roundRobin.js';
import { WuzapiService } from '../services/wuzapi.js';

export default async function webhookRoutes(fastify: FastifyInstance) {
  // Wuzapi Webhook
  fastify.post('/wuzapi', async (request, reply) => {
    const { token, message, phone, senderName } = request.body as any;

    const tenant = await prisma.tenant.findUnique({
      where: { wuzapiToken: token }
    });

    if (!tenant) return reply.code(401).send({ message: 'Token Wuzapi inválido' });
    if (tenant.subscriptionStatus !== 'active') return reply.code(403).send({ message: 'Assinatura expirada' });

    let lead = await prisma.lead.findUnique({
      where: { phone_tenantId: { phone, tenantId: tenant.id } }
    });

    if (!lead) {
      lead = await prisma.lead.create({
        data: { phone, name: senderName, tenantId: tenant.id }
      });
    }

    // Salva mensagem do lead
    await prisma.message.create({
      data: { content: message, sender: 'lead', leadId: lead.id, tenantId: tenant.id }
    });

    if (lead.status === 'AI_FOLLOW_UP' || lead.status === 'NEW') {
      const history = await prisma.message.findMany({
        where: { leadId: lead.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      const aiResponse = await askAI(message, history, tenant.id);

      await prisma.message.create({
        data: { content: aiResponse, sender: 'ai', leadId: lead.id, tenantId: tenant.id }
      });

      // Envia a resposta de volta ao Lead via Wuzapi
      try {
        await WuzapiService.sendMessage(tenant.wuzapiToken!, phone, aiResponse);
      } catch (error) {
        console.error('Erro ao enviar mensagem via Wuzapi:', error);
      }

      if (aiResponse.includes('[TRANSFERIR]')) {
        const seller = await getNextSeller(tenant.id);
        await prisma.lead.update({
          where: { id: lead.id },
          data: { 
            status: 'HUMAN_FOLLOW_UP',
            sellerId: seller?.id
          }
        });
        // Notificar vendedor via Wuzapi se necessário
        console.log(`Lead ${phone} transferido para ${seller?.name}`);
      }

      return { response: aiResponse };
    }

    return { status: 'received' };
  });

  // Cakto Webhook
  fastify.post('/cakto', async (request, reply) => {
    const { event, customer_email, status } = request.body as any;

    if (event === 'payment_confirmed' || status === 'active') {
      const user = await prisma.user.findUnique({ where: { email: customer_email } });
      if (user) {
        await prisma.tenant.update({
          where: { id: user.tenantId },
          data: { subscriptionStatus: 'active' }
        });
      }
    }

    return { status: 'success' };
  });
}
