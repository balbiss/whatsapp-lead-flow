import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../lib/prisma.js';
import { WuzapiService } from '../services/wuzapi.js';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const { name, email, password, companyName, segment } = request.body as any;

    const hashedPassword = await bcrypt.hash(password, 10);

    const wuzapiToken = crypto.randomUUID();

    const tenant = await prisma.tenant.create({
      data: {
        name: companyName,
        segment,
        wuzapiToken,
        users: {
          create: {
            name,
            email,
            password: hashedPassword,
            role: 'ADMIN'
          }
        }
      },
      include: { users: true }
    });

    try {
      await WuzapiService.createUser(companyName, wuzapiToken);
    } catch (e) {
      console.error('Wuzapi silent error during registration:', e);
    }

    const token = fastify.jwt.sign({ 
      id: tenant.users[0].id, 
      tenantId: tenant.id,
      role: 'ADMIN'
    });

    return { token, user: tenant.users[0], tenant };
  });

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { tenant: true }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return reply.code(401).send({ message: 'Credenciais inválidas' });
    }

    const token = fastify.jwt.sign({ 
      id: user.id, 
      tenantId: user.tenantId,
      role: user.role
    });

    return { token, user, tenant: user.tenant };
  });
}
