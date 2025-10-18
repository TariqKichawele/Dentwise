"use server";

import { prisma } from "../prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
    try {
        const user = await currentUser();
        if (!user) return null;
        
        const userExists = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });
        if (userExists) return userExists;

        const newUser = await prisma.user.create({
            data: { 
                clerkId: user.id, 
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.emailAddresses[0].emailAddress, 
                phone: user.phoneNumbers[0]?.phoneNumber,                
            },
        });
        return newUser;
    } catch (error) {
        console.error(error);
        return null;
    }
}

