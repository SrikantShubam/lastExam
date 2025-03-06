import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { put } from "@vercel/blob";

export async function POST(req) {
  try {
    console.time("Total Request Time");
    const formData = await req.formData();

    const email = formData.get("email");
    const contributionType = formData.get("contributionType");
    const message = formData.get("message");
    const file = formData.get("file");

    console.log("Form Data:", { email, contributionType, message, file });

    let fileUrl = null;
    if (file && file instanceof File && file.size > 5 * 1024 * 1024) {
      console.time("File Upload to Blob");
      const { url } = await put(file.name, file, { access: "public" });
      fileUrl = url;
      console.timeEnd("File Upload to Blob");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject:
        contributionType === "submit-pyqs"
          ? "Submit PYQs"
          : contributionType === "request-exam"
          ? "Request Exam"
          : "Join as Counselor/Educator",
      text: `
        Email: ${email}
        Contribution Type: ${contributionType}
        Message: ${message}
        ${fileUrl ? `File URL: ${fileUrl}` : file ? "File attached" : "No file attached"}
      `,
      attachments: fileUrl
        ? []
        : file && file instanceof File
        ? [{ filename: file.name, content: Buffer.from(await file.arrayBuffer()) }]
        : [],
    };

    console.time("Email Sending");
    await transporter.sendMail(mailOptions);
    console.timeEnd("Email Sending");

    console.timeEnd("Total Request Time");
    return NextResponse.json({ message: "Contribution submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Failed to submit contribution" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}