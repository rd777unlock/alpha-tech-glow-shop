// Vercel Serverless Function: Recebe notificações do gateway de pagamento
// Exemplo de uso: POST /api/webhook

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const webhook = req.body;
    console.log('Webhook recebido:', webhook);

    const { data } = webhook;

    switch (data.status) {
      case 'paid':
      case 'approved':
        // Atualizar pedido como pago
        console.log('Pagamento aprovado:', data.id);
        break;
      
      case 'refused':
        // Atualizar pedido como recusado
        console.log('Pagamento recusado:', data.id);
        break;
      
      case 'waiting_payment':
        // Aguardando pagamento (PIX/Boleto)
        console.log('Aguardando pagamento:', data.id);
        break;
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}