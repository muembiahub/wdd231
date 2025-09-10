import nodemailer from 'nodemailer';
import twilio from 'twilio';

export async function handler(event) {
  try {
    const data = JSON.parse(event.body);
    const { category, price, message, gps, clientEmail, clientWhatsApp } = data;

    // 1. Email via Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Kazidomo" <${process.env.GMAIL_USER}>`,
      to: clientEmail,
      subject: 'Confirmation de votre demande',
      text: `Bonjour,\n\nVotre demande pour "${category}" a bien été enregistrée.\nPrix estimatif : ${price} $\n\nKazidomo vous remercie.\n\nMessage :\n${message}\n\nGPS : ${gps}`
    });

    // 2. WhatsApp via Twilio
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio Sandbox
      to: `whatsapp:${clientWhatsApp}`,
      body: `✅ Bonjour ! Votre demande pour "${category}" a été enregistrée.\nPrix estimatif : ${price} $\n\nKazidomo vous remercie.`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Notifications envoyées avec succès." })
    };
  } catch (error) {
    console.error("Erreur dans la fonction contact :", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
}