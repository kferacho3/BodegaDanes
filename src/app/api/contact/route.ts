// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with your API key (kept server‑only)
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // 1) Notify admin
    await resend.emails.send({
      from   : process.env.SEND_FROM_EMAIL!,
      to     : [process.env.SEND_FROM_EMAIL!],
      subject: `New inquiry from ${name}`,
      text   : `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    // 2) Auto‐reply to user
    await resend.emails.send({
      from   : process.env.SEND_FROM_EMAIL!,
      to     : [email],
      subject: `Thanks for contacting Bodega Danes`,
      text   : `Hi ${name},\n\nThanks for your message! We’ll get back to you shortly.\n\n— The Bodega Danes Team`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
