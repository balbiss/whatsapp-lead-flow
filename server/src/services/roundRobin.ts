import prisma from '../lib/prisma.js';

export async function getNextSeller(tenantId: string) {
  // Busca o vendedor da empresa com o lastAssignedAt mais antigo
  const seller = await prisma.user.findFirst({
    where: {
      tenantId,
      role: 'SELLER'
    },
    orderBy: {
      lastAssignedAt: 'asc'
    }
  });

  if (!seller) return null;

  // Atualiza o timestamp para a próxima rodada
  await prisma.user.update({
    where: { id: seller.id },
    data: { lastAssignedAt: new Date() }
  });

  return seller;
}
