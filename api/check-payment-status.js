// /api/check-payment-status.js
// Consulta o status do pagamento na AxionPay

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { orderNumber, paymentId } = req.body;
    if (!orderNumber || !paymentId) {
      return res.status(400).json({ error: "orderNumber e paymentId são obrigatórios" });
    }

    const url = `https://api.axionpay.com.br/v1/transactions/${paymentId}`;
    const publicKey = process.env.AXIONPAY_PUBLIC_KEY;
    const secretKey = process.env.AXIONPAY_SECRET_KEY;
    const auth =
      "Basic " + Buffer.from(publicKey + ":" + secretKey).toString("base64");

    const gatewayRes = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
    });

    if (!gatewayRes.ok) {
      return res.status(gatewayRes.status).json({ error: "Erro ao consultar status do pagamento" });
    }

    const gatewayData = await gatewayRes.json();
    // Adapte a resposta conforme o que o AxionPay retorna
    res.status(200).json(gatewayData);
  } catch (error) {
    console.error("Erro ao consultar status do pagamento:", error);
    res.status(500).json({ error: "Erro ao consultar status do pagamento" });
  }
}
