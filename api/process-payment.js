// /api/process-payment.js
// Integração real com gateway de pagamento
// Substitua a URL e o payload conforme a documentação do seu gateway

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

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

    const gatewayRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const gatewayData = await gatewayRes.json();

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

    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    res.status(500).json({ error: "Erro ao processar pagamento" });
  }
}