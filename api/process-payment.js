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

    const payload = {
      amount,
      paymentMethod,
      pix: paymentMethod === "pix" ? { expiresInDays: 1 } : undefined,
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

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao processar pagamento" });
  }
}