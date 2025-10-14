'use server';

import { Gender } from "@prisma/client";
import { prisma } from "../prisma";
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";

interface CreateDoctorData {
    name: string;
    email: string;
    phone: string;
    speciality: string;
    gender: Gender;
    isActive: boolean;
}

interface UpdateDoctorData extends Partial<CreateDoctorData> {
    id: string;
}

export async function getDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                _count: { select: { appointments: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        return doctors.map(doctor => ({
            ...doctor,
            appointmentCount: doctor._count.appointments
        }));
    } catch (error) {
        console.log("Error fetching doctors", error);
        throw new Error("Failed to fetch doctors");
    }
};

export async function createDoctor(data: CreateDoctorData) {
    try {
        if (!data.name || !data.email) throw new Error("Name and email are required");

        const doctor = await prisma.doctor.create({
            data: {
                ...data,
                imageUrl: generateAvatar(data.name, data.gender)
            }
        });

        revalidatePath("/admin");

        return doctor;
    } catch (error: any) {
        console.error("Error creating doctor:", error);

        if (error?.code === "P2002") {
            throw new Error("A doctor with this email already exists");
        }

        throw new Error("Failed to create doctor");
    }
}

export async function updateDoctor(data: UpdateDoctorData) {
    try {
        if (!data.name || !data.email) throw new Error("Name and email are required");

        const currentDoctor = await prisma.doctor.findUnique({
            where: { id: data.id },
            select: { email: true }
        });

        if (!currentDoctor) throw new Error("Doctor not found");

        if (currentDoctor.email !== data.email) {
            const existingDoctor = await prisma.doctor.findUnique({
                where: { email: data.email },
            });
            if (existingDoctor) throw new Error("A doctor with this email already exists");
        }
        
        const doctor = await prisma.doctor.update({
            where: { id: data.id },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                speciality: data.speciality,
                gender: data.gender,
                isActive: data.isActive
            }
        });

        revalidatePath("/admin");

        return doctor;
    } catch (error) {
        console.error("Error updating doctor:", error);
        throw new Error("Failed to update doctor");
    }
};

export async function getAvailableDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: { appointments: true }
                }
            },
            orderBy: { name: "asc" }
        });

        return doctors.map(doctor => ({
            ...doctor,
            appointmentCount: doctor._count.appointments
        }));
    } catch (error) {
        console.error("Error fetching available doctors:", error);
        throw new Error("Failed to fetch available doctors");
    }
};

