'use server';

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";
import { AppointmentStatus } from "@prisma/client";

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

export async function getUserAppointments() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("You must be logged in to view your appointments");

        const user = await prisma.user.findUnique({ where: { clerkId: userId }});
        if (!user) throw new Error("User not found");

        const appointments = await prisma.appointment.findMany({
            where: { userId: user.id },
            include: {
                user: { select: { firstName: true, lastName: true, email: true }},
                doctor: { select: { name: true, imageUrl: true }},
            },
            orderBy: [{ date: "asc"}, { time: "asc" }]
        });

        return appointments.map(transformAppointment);
    } catch (error) {
        console.error("Error fetching user appointments:", error);
        throw new Error("Failed to fetch user appointments");
    }
};


export async function getUserAppointmentsStats() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("You must be authenticated to view your appointments stats");

        const user = await prisma.user.findUnique({ where: { clerkId: userId }});
        if (!user) throw new Error("User not found");

        const [totalCount, completedCount] = await Promise.all([
            prisma.appointment.count({ where: { userId: user.id }}),
            prisma.appointment.count({ where: { userId: user.id, status: "COMPLETED" }}),
        ]);

        return {
            totalAppointments: totalCount,
            completedAppointments: completedCount,
        };
    } catch (error) {
        console.error("Error fetching user appointments stats:", error);
        throw new Error("Failed to fetch user appointments stats");
    }
}

export async function getBookedTimeSlots(doctorId: string, date: string) {
    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                date: new Date(date),
                status: {
                    in: ["CONFIRMED", "COMPLETED"]
                }
            },
            select: { time: true }
        });

        return appointments.map(appointment => appointment.time);
    } catch (error) {
        console.error("Error fetching booked time slots:", error);
        throw new Error("Failed to fetch booked time slots");
    }
};

interface BookAppointmentInput {
    doctorId: string;
    date: string;
    time: string;
    reason?: string;
};


export async function bookAppointment(data: BookAppointmentInput) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("You must be authenticated to book an appointment");

        if (!data.doctorId || !data.date || !data.time) throw new Error("All fields are required");

        const user = await prisma.user.findUnique({ where: { clerkId: userId }});
        if (!user) throw new Error("User not found");

        const appointment = await prisma.appointment.create({
            data: {
                userId: user.id,
                doctorId: data.doctorId,
                date: new Date(data.date),
                time: data.time,
                reason: data.reason || "General Consultation",
                status: "CONFIRMED",
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                doctor: { select: { name: true, imageUrl: true }},
            }
        });

        return transformAppointment(appointment);
    } catch (error) {
        console.error("Error booking appointment:", error);
        throw new Error("Failed to book appointment");
    }
}

export async function updateAppointmentStatus(data: { id: string, status: AppointmentStatus }) {
    try {
        const appointment = await prisma.appointment.update({
            where: { id: data.id },
            data: { status: data.status }
        });

        return appointment;
    } catch (error) {
        console.error("Error updating appointment status:", error);
        throw new Error("Failed to update appointment status");
    }
}