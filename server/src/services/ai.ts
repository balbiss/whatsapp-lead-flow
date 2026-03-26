import axios from 'axios';
import prisma from '../lib/prisma.js';

export async function askAI(content: string, history: any[], tenantId: string) {
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  
  const systemPrompt = tenant?.aiPrompt || "Você é um atendente prestativo. Foque em ajudar o cliente e vender.";
  
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(h => ({ role: h.sender === 'lead' ? 'user' : 'assistant', content: h.content })),
    { role: 'user', content }
  ];

  try {
    // Simulando chamada para OpenAI/Gemini
    // No ambiente real, usaríamos a biblioteca oficial ou axios
    // const response = await axios.post('https://api.openai.com/v1/chat/completions', { ... });
    
    // Simulação de resposta da IA
    let aiResponse = "Olá! Como posso te ajudar hoje?";
    
    if (content.toLowerCase().includes("humano") || content.toLowerCase().includes("atendente")) {
      aiResponse = "Entendo. Estou transferindo você para um dos nossos especialistas agora mesmo. Aguarde um momento. [TRANSFERIR]";
    }

    return aiResponse;
  } catch (error) {
    console.error('AI Error:', error);
    return "Desculpe, tive um problema técnico. Pode repetir?";
  }
}
