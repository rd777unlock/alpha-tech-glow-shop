// Vercel Serverless Function: Recebe notificações do gateway de pagamento
// Exemplo de uso: POST /api/webhook

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  // Recebe o payload do gateway
  const event = req.body;

  // Aqui você pode validar a assinatura do webhook, se o gateway fornecer
  // Exemplo: if (!isValidSignature(req)) return res.status(401).json({ error: 'Assinatura inválida' });

  // Exemplo: Atualize o status do pedido em um banco de dados ou arquivo
  // await updateOrderStatus(event.orderId, event.status);

  // MOCK: Apenas loga o evento recebido
  console.log('Webhook recebido:', event);

  // Retorna 200 para o gateway
  return res.status(200).json({ received: true });
}