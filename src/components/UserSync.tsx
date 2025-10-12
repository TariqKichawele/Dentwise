import { syncUser } from "@/lib/actions/users";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";


function UserSync() {
    const { isSignedIn, isLoaded } = useUser();

    useEffect(() => {
        const handleUserSync = async () => {
            if (isSignedIn && isLoaded) {
                try {
                    await syncUser();
                } catch (error) {
                    console.error(error);
                }
            }
        }
        handleUserSync();
    }, [isSignedIn, isLoaded])

    return null;
}

export default UserSync;