// === server.js pour l'envoi de données ===
const express = require('express');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Email transporteur (Zoho Mail)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Route pour envoyer l'email au client
app.post('/notify-client', async (req, res) => {
  const { email } = req.body;

const { data, error } = await supabase
  .from('kazidomo_demandes_services')
  .select('*')
  .eq('clientEmail', email)
  .order('created_at', { ascending: false })
  .limit(1);


  if (error || !data || data.length === 0) {
    return res.status(404).json({ message: 'Aucune donnée trouvée pour cet email.' });
  }

  const request = data[0];

  const mailOptions = {
    from: `"Kazidomo Service" <${process.env.EMAIL_USER}>`,
    to: request.clientEmail,
    subject: `Confirmation de votre demande : ${request.serviceCategory}`,
    html: `
      <h2>Bonjour ${request.clientName},</h2>
      <p>Merci pour votre demande concernant le service <strong>${request.serviceCategory}</strong> au prix de <strong>${request.servicePrice}</strong>.</p>
      <p><strong>Message :</strong> ${request.clientMessage}</p>
      <p><strong>WhatsApp :</strong> ${request.clientWhatsApp}</p>
      <p><strong>Coordonnées GPS :</strong> ${request.gps}</p>
      <p><a href="${request.map_url}" target="_blank">Voir la carte</a></p>
      <p>Nous vous contacterons bientôt.</p>
      <br>
      <p>Cordialement,<br>L’équipe Kazidomo</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);

    // ✅ Met à jour le champ sentAt après envoi réussi
    await supabase
      .from('kazidomo_demandes_services')
      .update({ sentAt: new Date().toISOString() })
      .eq('clientEmail', request.clientEmail);

    res.status(200).json({ message: '✅ Email envoyé avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Erreur lors de l’envoi de l’email.' });
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
