"use client";

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/')
            router.refresh()
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50">
            {/* Main Login Card */}
            <div className="w-full max-w-[350px] bg-white border border-gray-300 shadow-sm flex flex-col items-center p-8 mb-4">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8 gap-2">
                    <div className="relative w-16 h-16">
                        <Image src="/logo.png" alt="Smart City Logo" fill className="object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold font-serif tracking-tight mt-2">Smart City</h1>
                </div>

                <form onSubmit={handleLogin} className="w-full flex flex-col gap-2">
                    {error && <div className="text-red-500 text-xs text-center mb-2">{error}</div>}

                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="Phone number, username, or email"
                            className="bg-zinc-50 border-gray-300 text-xs h-9 focus-visible:ring-0 focus-visible:border-gray-400 rounded-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative mb-2">
                        <Input
                            type="password"
                            placeholder="Password"
                            className="bg-zinc-50 border-gray-300 text-xs h-9 focus-visible:ring-0 focus-visible:border-gray-400 rounded-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold h-8 rounded-[8px] text-sm mt-2"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Log in"}
                    </Button>
                </form>

                <div className="flex items-center w-full my-4">
                    <div className="h-px bg-gray-300 flex-1"></div>
                    <span className="text-[13px] font-semibold text-gray-500 px-4">OR</span>
                    <div className="h-px bg-gray-300 flex-1"></div>
                </div>

                <button className="flex items-center justify-center text-[#385185] text-sm font-semibold mb-3">
                    <span className="mr-2">🔵</span> Log in with Facebook
                </button>

                <Link href="#" className="text-xs text-[#00376b] text-center mt-2">
                    Forgot password?
                </Link>
            </div>

            {/* Sign Up Redirect */}
            <div className="w-full max-w-[350px] bg-white border border-gray-300 shadow-sm p-5 text-center">
                <p className="text-sm">
                    Don't have an account? <Link href="/signup" className="text-[#0095f6] font-semibold">Sign up</Link>
                </p>
            </div>

            {/* Footer / Get the App (Optional) */}
            <div className="mt-4 flex flex-col items-center gap-4">
                <p className="text-sm text-gray-600">Get the app.</p>
                <div className="flex gap-2">
                    <div className="h-10 w-32 bg-black rounded-lg flex items-center justify-center text-white text-xs font-bold border border-white/20">
                        Get it on<br />Google Play
                    </div>
                    <div className="h-10 w-32 bg-black rounded-lg flex items-center justify-center text-white text-xs font-bold border border-white/20">
                        Download on the<br />App Store
                    </div>
                </div>
            </div>
        </div>
    )
}

