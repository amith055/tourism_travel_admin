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
    const { to, hotelName, status, reason } = await req.json();

    if (!to || !hotelName || typeof status === "undefined") {
      return Response.json(
        { error: "Missing required fields: to, hotelName, status" },
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
        ? `✅ Hotel ${hotelName} Approved`
        : `❌ Hotel ${hotelName} Rejected`;

    const text =
      status === true
        ? `Dear Owner,\n\nYour hotel "${hotelName}" has been approved successfully. You can now access the platform and manage your listings.\n\nThank you for partnering with LokVista!`
        : `Dear Owner,\n\nUnfortunately, your hotel "${hotelName}" has been rejected.\nReason: ${reason || "Not specified"}\n\nPlease review your details and try again.\n\nThank you,\nLokVista Team`;

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
