'use server';

import { prisma } from "../prisma";


function transformAppointment(appointment: any) {
    return {
      ...appointment,
      patientName: `${appointment.user.firstName || ""} ${appointment.user.lastName || ""}`.trim(),
      patientEmail: appointment.user.email,
      doctorName: appointment.doctor.name,
      doctorImageUrl: appointment.doctor.imageUrl || "",
      date: appointment.date.toISOString().split("T")[0],
    };
};


export async function getAppointments() {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                doctor: {
                    select: {
                        name: true,
                        imageUrl: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return appointments.map(transformAppointment);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw new Error("Failed to fetch appointments");
    }
}