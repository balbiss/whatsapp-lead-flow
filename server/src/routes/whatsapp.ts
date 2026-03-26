import { FastifyInstance } from 'fastify';
import prisma from '../lib/prisma.js';
import { WuzapiService } from '../services/wuzapi.js';
import crypto from 'crypto';

export default async function whatsappRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      fastify.log.error('ERR_JWT_VERIFY: Authentication failed for request');
      reply.send(err);
    }
  });

  fastify.get('/status', async (request: any, reply) => {
    fastify.log.info('--- STATUS REQUEST RECEIVED ---');
    const { tenantId } = request.user;
    fastify.log.info(`Tenant ID from JWT: ${tenantId}`);

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant || !tenant.wuzapiToken) {
      return { status: 'no_instance', message: 'Nenhuma instância criada' };
    }

    const result = await WuzapiService.getStatus(tenant.wuzapiToken);
    console.log(`[DEBUG] Status check for tenant ${tenantId}:`, result);
    
    // Map Wuzapi response (PascalCase or lowercase) to frontend expected status
    if (result.Connected || result.connected) {
      return { status: 'online', ...result };
    }
    
    return { status: 'offline', ...result };
  });

  fastify.post('/instance', async (request: any) => {
    const { tenantId } = request.user;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) return { error: 'Tenant não encontrado' };
    if (tenant.wuzapiToken) return { message: 'Instância já existe', token: tenant.wuzapiToken };

    const token = crypto.randomBytes(16).toString('hex');
    
    try {
      await WuzapiService.createUser(tenant.name, token);
      
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { wuzapiToken: token }
      });

      return { status: 'success', message: 'Instância criada com sucesso', token };
    } catch (error: any) {
      return { error: 'Erro ao criar instância', details: error.message };
    }
  });

  fastify.post('/connect', async (request: any) => {
    const { tenantId } = request.user;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant || !tenant.wuzapiToken) {
      return { error: 'Instância não criada. Crie a instância primeiro.' };
    }

    const result = await WuzapiService.connect(tenant.wuzapiToken);
    return result;
  });

  fastify.get('/qr', async (request: any) => {
    const { tenantId } = request.user;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant || !tenant.wuzapiToken) {
      return { error: 'Instância não criada.' };
    }

    const result = await WuzapiService.getQR(tenant.wuzapiToken);
    return result;
  });

  fastify.post('/pairphone', async (request: any) => {
    const { tenantId } = request.user;
    const { phone } = request.body || {};

    if (!phone) {
      return { error: 'Número de telefone é obrigatório.' };
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant || !tenant.wuzapiToken) {
      return { error: 'Instância não criada.' };
    }

    const result = await WuzapiService.pairPhone(tenant.wuzapiToken, phone);
    return result;
  });

  fastify.post('/disconnect', async (request: any) => {
    const { tenantId } = request.user;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant || !tenant.wuzapiToken) {
      return { error: 'Nenhuma instância para desconectar' };
    }

    const result = await WuzapiService.disconnect(tenant.wuzapiToken);
    return result;
  });

  fastify.delete('/instance', async (request: any) => {
    const { tenantId } = request.user;
    
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant?.wuzapiToken) {
      return { status: 'error', message: 'Nenhuma instância encontrada' };
    }

    try {
      // 1. Delete from Wuzapi
      await WuzapiService.deleteUser(tenant.wuzapiToken);
    } catch (error) {
      console.error('Error deleting from Wuzapi:', error);
      // Even if Wuzapi fails (user already deleted), we continue to cleanup our DB
    }

    // 2. Clear from our database
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { wuzapiToken: null }
    });

    return { status: 'success', message: 'Instância removida com sucesso' };
  });
}
