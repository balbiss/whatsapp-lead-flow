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
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'seu_token_openai') {
      console.warn('[AI] OPENAI_API_KEY not set, using mock response');
      return getMockResponse(content);
    }

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('AI Error:', error.response?.data || error.message);
    return "Desculpe, tive um problema técnico. Pode repetir?";
  }
}

function getMockResponse(content: string) {
  let aiResponse = "Olá! Como posso te ajudar hoje?";
  if (content.toLowerCase().includes("humano") || content.toLowerCase().includes("atendente")) {
    aiResponse = "Entendo. Estou transferindo você para um dos nossos especialistas agora mesmo. Aguarde um momento. [TRANSFERIR]";
  }
  return aiResponse;
}
