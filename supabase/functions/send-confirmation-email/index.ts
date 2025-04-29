
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ConfirmationRequest {
  email: string;
  name: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  items: OrderItem[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, orderNumber, totalAmount, paymentMethod, items }: ConfirmationRequest = await req.json();

    console.log("Enviando email de confirmação para:", email);
    console.log("Dados do pedido:", { orderNumber, totalAmount, paymentMethod });

    // Aqui você integraria com um serviço de email como SendGrid, Resend, etc.
    // Por enquanto, apenas simulamos o envio

    const formatCurrency = (value: number) => {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    };

    // Gerar HTML para os itens do pedido
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
      </tr>
    `).join('');

    // Template do email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmação de Pedido</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #121214; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #777; }
          .button { display: inline-block; padding: 10px 20px; background-color: #4C6FFF; color: white; text-decoration: none; border-radius: 4px; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; padding: 10px; border-bottom: 2px solid #ddd; }
          .total { font-weight: bold; margin-top: 20px; text-align: right; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pedido Confirmado!</h1>
          </div>
          <div class="content">
            <p>Olá ${name},</p>
            <p>Obrigado por sua compra. Seu pedido foi confirmado e está sendo processado.</p>
            
            <h2>Detalhes do Pedido</h2>
            <p><strong>Número do Pedido:</strong> ${orderNumber}</p>
            <p><strong>Método de Pagamento:</strong> ${
              paymentMethod === 'credit' ? 'Cartão de Crédito' : 
              paymentMethod === 'pix' ? 'PIX' : 'Boleto Bancário'
            }</p>
            
            <h3>Itens</h3>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th style="text-align: center;">Quantidade</th>
                  <th style="text-align: right;">Preço</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <p class="total">Total: ${formatCurrency(totalAmount)}</p>
            
            <p>Você receberá atualizações sobre o status do seu pedido por email.</p>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="https://seu-site.com/minha-conta/pedidos" class="button">Acompanhar Pedido</a>
            </p>
          </div>
          <div class="footer">
            <p>Este é um email automático, por favor não responda.</p>
            <p>&copy; 2025 Alpha Tech. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Como não temos um serviço de email configurado, retornamos uma resposta simulada
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email de confirmação simulado para ${email}` 
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Erro desconhecido" }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 500,
      }
    );
  }
});
