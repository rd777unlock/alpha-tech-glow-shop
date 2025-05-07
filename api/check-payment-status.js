// /api/check-payment-status.js
// Consulta o status do pagamento na AxionPay

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { paymentId } = req.body;
    const url = `https://api.axionpay.com.br/v1/transactions/${paymentId}`;
    const publicKey = process.env.AXIONPAY_PUBLIC_KEY;
    const secretKey = process.env.AXIONPAY_SECRET_KEY;
    const auth = "Basic " + Buffer.from(publicKey + ":" + secretKey).toString("base64");

    const response = await fetch(url, {
      headers: { Authorization: auth }
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar status" });
  }
}
