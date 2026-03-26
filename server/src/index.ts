import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import webhookRoutes from './routes/webhook.js';
import leadRoutes from './routes/leads.js';
import whatsappRoutes from './routes/whatsapp.js';

dotenv.config({ override: true });
console.log('[DEBUG] DATABASE_URL loaded:', process.env.DATABASE_URL);

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
  },
});

fastify.register(cors, { 
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token']
});

fastify.setErrorHandler((error: any, request, reply) => {
  const statusCode = error.statusCode || error.status || 500;
  fastify.log.error(error);
  reply.status(statusCode).send({ 
    error: statusCode === 500 ? 'Internal Server Error' : error.name, 
    message: error.message || 'Erro desconhecido',
    details: (process.env.NODE_ENV === 'development' || true) ? error.stack : undefined
  });
});
fastify.register(jwt, { secret: process.env.JWT_SECRET || 'supersecret' });

// Public Routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(webhookRoutes, { prefix: '/api/webhooks' });

// Private Routes
fastify.register(leadRoutes, { prefix: '/api/leads' });
fastify.register(whatsappRoutes, { prefix: '/api/whatsapp' });

const start = async () => {
  try {
    await fastify.listen({ port: 3006, host: '0.0.0.0' });
    console.log('--- SERVIDOR REINICIADO COM SUCESSO ---');
    console.log('Servidor Backend SaaS rodando na porta 3006');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
