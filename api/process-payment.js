// /api/process-payment.js
// Integração real com gateway de pagamento
// Substitua a URL e o payload conforme a documentação do seu gateway

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { amount, paymentMethod, items, customer } = req.body;

    const url = "https://api.axionpay.com.br/v1/transactions";
    const publicKey = process.env.AXIONPAY_PUBLIC_KEY;
    const secretKey = process.env.AXIONPAY_SECRET_KEY;
    const auth = "Basic " + Buffer.from(publicKey + ":" + secretKey).toString("base64");

    // Monta o payload conforme documentação da AxionPay
    const payload = {
      amount: Math.round(amount * 100), // Converte para centavos
      paymentMethod,
      // Configuração específica para PIX
      pix: paymentMethod === "pix" ? { 
        expiresInDays: 1,
      } : undefined,
      items: items.map(item => ({
        title: item.name,
        unitPrice: Math.round(item.price * 100),
        quantity: item.quantity,
        tangible: true,
        externalRef: item.id.toString()
      })),
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        document: {
          number: customer.document,
          type: "cpf"
        }
      },
      postbackUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/webhook`
    };

    console.log("Enviando payload para AxionPay:", payload);

    const gatewayRes = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const gatewayData = await gatewayRes.json();
    console.log("Resposta da AxionPay:", gatewayData);

    // Padroniza a resposta para o frontend
    const response = {
      status: gatewayData.status || "pending",
      paymentId: gatewayData.id,
      message: gatewayData.message || ""
    };

    // Adiciona dados específicos do PIX
    if (paymentMethod === "pix" && gatewayData.pix) {
      response.pixQrCode = gatewayData.pix.qrCodeImageUrl || gatewayData.pix.qr_code_url;
      response.pixCode = gatewayData.pix.qrCode || gatewayData.pix.qr_code;
    }

    // Adiciona dados específicos do boleto
    if (paymentMethod === "boleto" && gatewayData.boleto) {
      response.boletoUrl = gatewayData.boleto.url;
      response.boletoNumber = gatewayData.boleto.number;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    res.status(500).json({ error: "Erro ao processar pagamento" });
  }
}