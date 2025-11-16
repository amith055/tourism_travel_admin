import { google } from "googleapis";
import nodemailer from "nodemailer";

const OAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

OAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { to, placeName, status, reason } = await req.json();

    if (!to || !placeName || typeof status === "undefined") {
      return Response.json(
        { error: "Missing required fields: to, placeName, status" },
        { status: 400 }
      );
    }

    const accessToken = await OAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken?.token,
      },
    });

    const subject =
      status === true
        ? `✅ Your place "${placeName}" has been approved`
        : `❌ Your place "${placeName}" has been rejected`;

    const text =
      status === true
        ? `Dear Contributor,\n\nYour submitted place "${placeName}" has been successfully verified and approved by the LokVista team.\n\nIt is now live on our platform, helping travelers discover the beauty of your region!\n\nThank you for contributing to LokVista.\n\nWarm regards,\nTeam LokVista`
        : `Dear Contributor,\n\nUnfortunately, your submitted place "${placeName}" could not be approved at this time.\nReason: ${reason || "Not specified"}\n\nYou may review and resubmit after making the necessary improvements.\n\nThank you for your effort in promoting local culture and tourism.\n\nWarm regards,\nTeam LokVista`;

    const mailOptions = {
      from: `"LokVista Team" <${process.env.USER_EMAIL}>`,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", result.response);

    return Response.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("❌ Error sending email:", error);
    return Response.json(
      { success: false, error: error.message || "Email sending failed" },
      { status: 500 }
    );
  }
}
