import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import AppointmentConfirmationEmail from "@/components/Emails/AppointmentConfirmationEmail";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            userEmail,
            doctorName,
            appointmentDate,
            appointmentTime,
            appointmentType,
            duration,
            price
        } = body;

        if (!userEmail || !doctorName || !appointmentDate || !appointmentTime || !appointmentType || !duration || !price) {
            return new Response("Missing required fields", { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: "DentWise <no-reply@resend.dev>",
            to: [userEmail],
            subject: "Appointment Confirmation - DentWise",
            react: AppointmentConfirmationEmail({
                doctorName,
                appointmentDate,
                appointmentTime,
                appointmentType,
                duration,
                price
            })
        });

        if (error) {
            console.error("Error sending email:", error);
            return new Response("Failed to send email", { status: 500 });
        };

        return NextResponse.json(
            { message: "Email sent successfully",emailData: data?.id },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response("Internal server error", { status: 500 });
    }
}