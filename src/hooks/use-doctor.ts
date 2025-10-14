'use client';

import { useMutation, useQuery } from "@tanstack/react-query";
import { createDoctor, getAvailableDoctors, getDoctors, updateDoctor } from "@/lib/actions/doctors";
import { useQueryClient } from "@tanstack/react-query";

export function useGetDoctors() {
    const result = useQuery({
        queryKey: ["getDoctors"],
        queryFn: getDoctors
    });

    return result;
}

export function useCreateDoctor() {
    const queryClient = useQueryClient();

    const result = useMutation({
        mutationFn: createDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
        },
        onError: (error) => {
            console.error("Error creating doctor:", error);
        },
    });

    return result;
}

export function useUpdateDoctor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateDoctor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableDoctors"] });
        },
        onError: (error) => {
            console.error("Error updating doctor:", error);
        },
    })
};

export function useGetAvailableDoctors() {
    const result = useQuery({
        queryKey: ["getAvailableDoctors"],
        queryFn: getAvailableDoctors
    })

    return result;
}