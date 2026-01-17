const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

Deno.serve(async (req) => {
  const { email, name, category, price, gps } = await req.json();

  const html = `
    <p>Bonjour <strong>${name}</strong>,</p>
    <p>🙏 Merci pour votre demande concernant le service <strong>« ${category} »</strong>.</p>
    <p>📌 Prix estimatif : <strong>${price} $</strong><br>
    📍 Localisation : <a href="https://www.google.com/maps?q=${gps}">${gps}</a></p>
    <p>Un agent Kazidomo vous contactera sous peu.</p>
    <hr>
    <p style="font-style: italic; color: #555;">
    « Chaque demande est une graine de confiance. Que cette démarche soit bénie. »
    </p>
    <p>— L’équipe Kazidomo</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "contact@kazidomo.com",
      to: email,
      subject: "Confirmation de votre demande",
      html,
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
});
