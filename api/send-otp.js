// /api/send-otp.js
// Envia o código OTP para o email do admin usando Resend

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email e OTP são obrigatórios" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key do Resend não configurada" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "no-reply@suadominio.com", // Troque para um domínio verificado no Resend
        to: email,
        subject: "Seu código OTP de acesso ao painel admin",
        html: `<p>Seu código OTP é: <b>${otp}</b></p>`
      }),
    });
    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: "Falha ao enviar email", details: error });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao enviar email", details: error.message });
  }
}
