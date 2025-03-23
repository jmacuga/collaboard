import { Team } from "@prisma/client";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  if (
    process.env.TWILIO_API_KEY == null ||
    process.env.TWILIO_EMAIL == null ||
    process.env.TWILIO_HOST == null ||
    process.env.TWILIO_USERNAME == null ||
    process.env.TWILIO_PORT == null
  ) {
    throw new Error("TWILIO_API_KEY or TWILIO_EMAIL is not set");
  }

  const transport = nodemailer.createTransport({
    host: process.env.TWILIO_HOST,
    port: parseInt(process.env.TWILIO_PORT),
    secure: false,
    auth: {
      user: process.env.TWILIO_USERNAME,
      pass: process.env.TWILIO_API_KEY,
    },
  });

  await transport.sendMail({
    from: process.env.TWILIO_EMAIL,
    to,
    subject: subject,
    text: text,
    html: html,
  });
}

export async function sendInvitationEmail(
  to: string,
  team: Team,
  hostName: string = "A team member"
) {
  try {
    const templatePath = path.join(
      process.cwd(),
      "lib/utils/mail/templates/invite.html"
    );
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");

    const siteUrl = process.env.NEXTAUTH_URL || process.env.DOMAIN;
    if (siteUrl == null) {
      throw new Error("NEXTAUTH_URL or DOMAIN is not set");
    }
    htmlTemplate = htmlTemplate
      .replace(/{{hostName}}/g, hostName)
      .replace(/{{teamName}}/g, team.name)
      .replace(/{{siteUrl}}/g, siteUrl)
      .replace(/{{inviteeEmail}}/g, encodeURIComponent(to));

    const plainText = `
      You've been invited to join ${team.name} on CollaBoard by ${hostName}.
      
      If you already have an account, visit: ${siteUrl}/teams
      
      If you need to create an account: ${siteUrl}/sign-up?email=${encodeURIComponent(
      to
    )}
      
      This invitation will expire in 7 days.
    `;

    await sendEmail(
      to,
      `Invitation to join ${team.name} on CollaBoard`,
      plainText,
      htmlTemplate
    );
  } catch (error) {
    console.error("Error sending invitation email:", error);
    await sendEmail(
      to,
      "Invitation to join team",
      `You are invited to join team ${team.name}`
    );
  }
}
