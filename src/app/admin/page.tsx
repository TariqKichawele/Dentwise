import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import AdminDashboard from './_AdminDashboard';

const Admin = async () => {
    const user = await currentUser();

    if (!user) redirect("/");

    const adminEmail = process.env.ADMIN_EMAIL;
    if (user.emailAddresses[0].emailAddress !== adminEmail || !adminEmail) redirect("/");

  return (
    <AdminDashboard />
  )
}

export default Admin