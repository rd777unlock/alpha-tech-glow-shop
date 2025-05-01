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

    // Adapte a resposta conforme o que o AxionPay retorna
    res.status(200).json(gatewayData);
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    res.status(500).json({ error: "Erro ao processar pagamento" });
  }
}