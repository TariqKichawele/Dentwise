import { auth } from '@clerk/nextjs/server'
import React from 'react'
import ProPlanRequired from '@/components/Voice/ProPlanRequired'
import Navbar from '@/components/Navbar'
import Welcome from '@/components/Voice/Welcome'
import Features from '@/components/Voice/Features'
import VapiWidget from '@/components/Voice/VapiWidget'

const Voice = async () => {
    const { has } = await auth();

    const isPro = has({ plan: "ai_basic" }) || has({ plan: "ai_pro" });

    if (!isPro) return <ProPlanRequired />

  return (
    <div className='min-h-screen bg-background'>
        <Navbar />

        <div className='max-w-7xl mx-auto px-6 py-8 pt-24'>
            <Welcome />
            <Features />
        </div>

        <VapiWidget />
    </div>
  )
}

export default Voice