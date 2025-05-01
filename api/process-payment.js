// /api/process-payment.js
// Integração real com gateway de pagamento
// Substitua a URL e o payload conforme a documentação do seu gateway

// Função utilitária para enviar mensagem ao Telegram
async function sendTelegramMessage(botToken, chatId, message) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("Erro ao enviar mensagem para o Telegram:", err);
  }
}

export default async function handler(req, res) {
  console.log("[PROCESS-PAYMENT] Request recebido:", req.method, req.body);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  // Defina os tokens e chat_id via variáveis de ambiente
  const TELEGRAM_SALES_BOT_TOKEN = process.env.TELEGRAM_SALES_BOT_TOKEN;
  const TELEGRAM_ERROR_BOT_TOKEN = process.env.TELEGRAM_ERROR_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  try {
    const {
      orderNumber,
      amount,
      paymentMethod,
      customer,
      card,
      cart,
    } = req.body;

    const url = "https://api.axionpay.com.br/v1/transactions";
    const publicKey = process.env.AXIONPAY_PUBLIC_KEY;
    const secretKey = process.env.AXIONPAY_SECRET_KEY;
    const auth =
      "Basic " + Buffer.from(publicKey + ":" + secretKey).toString("base64");

    // Monte o payload conforme a documentação do AxionPay
    const payload = {
      amount,
      paymentMethod,
      orderNumber,
      customer,
      card,
      cart,
    };

    console.log("[PROCESS-PAYMENT] Enviando para AxionPay:", payload);

    const gatewayRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const gatewayData = await gatewayRes.json();
    console.log("[PROCESS-PAYMENT] Resposta AxionPay:", gatewayData);

    // Padroniza a resposta para o frontend
    let response = {
      status: gatewayData.status || gatewayData.transactionStatus || "pending",
      paymentId: gatewayData.id || gatewayData.paymentId || null,
      message: gatewayData.message || "",
    };

    // PIX
    if (paymentMethod === "pix" && gatewayData.pix) {
      response.pixQrCode = gatewayData.pix.qrCodeImageUrl || gatewayData.pix.qr_code_image_url || gatewayData.pix.qr_code_url || "";
      response.pixCode = gatewayData.pix.qrCode || gatewayData.pix.qr_code || "";
    }

    // Boleto
    if (paymentMethod === "boleto" && gatewayData.boleto) {
      response.boletoUrl = gatewayData.boleto.url || gatewayData.boleto.boleto_url || "";
      response.boletoNumber = gatewayData.boleto.number || gatewayData.boleto.boleto_number || "";
    }

    // Cartão de crédito
    if (paymentMethod === "credit" && gatewayData.card) {
      response.cardLast4 = gatewayData.card.last4 || "";
      response.authCode = gatewayData.card.authCode || gatewayData.card.auth_code || "";
    }

    // Envia log de venda para o Telegram (apenas se sucesso/pending)
    if (TELEGRAM_SALES_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const msg = `🛒 <b>Nova venda</b>\nPedido: <b>${orderNumber}</b>\nMétodo: <b>${paymentMethod}</b>\nValor: <b>R$ ${(amount/100).toFixed(2)}</b>\nCliente: <b>${customer?.name || "-"}</b>\nStatus: <b>${response.status}</b>`;
      sendTelegramMessage(TELEGRAM_SALES_BOT_TOKEN, TELEGRAM_CHAT_ID, msg);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    // Envia log de erro para o Telegram
    if (process.env.TELEGRAM_ERROR_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const msg = `❌ <b>Erro no pagamento</b>\n${error instanceof Error ? error.message : error}`;
      sendTelegramMessage(process.env.TELEGRAM_ERROR_BOT_TOKEN, process.env.TELEGRAM_CHAT_ID, msg);
    }
    res.status(500).json({ error: "Erro ao processar pagamento" });
  }
}