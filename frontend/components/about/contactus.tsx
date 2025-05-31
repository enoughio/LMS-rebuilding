'use client'
import Image from "next/image"
import { useState } from "react"
import { plusJakarta } from "@/app/fonts"

export default function ContactUs(){
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState(false)

    const [submit, setSubmit] = useState("")

    const handleSubmit = () => {
        if (!email || !name || !password) {
            setSubmit(" Please fill in all fields.")
            return
        }

        setSubmit("Account created successfully!!")


        setEmail("")
        setName("")
        setPassword("")
        setRemember(false)
    }

    return (
        <section className={`bg-[#796146] ${plusJakarta.className} w-full flex flex-col md:flex-row rounded-lg relative p-4 overflow-hidden mb-8 `}>
            {/* Image Left */}
            <div className="img_left hidden md:block w-full md:w-1/2 h-24 sm:h-64 md:h-auto relative">
                <Image src="/join.png" width={400} height={30} alt="join us today" className="w-full h-[90%] absolute z-100 top-0" />
            </div>


            <div className="right_side w-full md:w-1/2 p-4 sm:p-6 md:px-10 lg:px-16 xl:px-20 text-white">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40.84px] leading-tight text-center font-bold mb-4">
                    Join us today 👋
                </h1>

                <p className="mb-6 text-sm sm:text-base text-left">
                    Clarity gives you the blocks and components you need to create a truly professional website.
                </p>


                <div className="px-4 py-2 bg-black rounded-full flex items-center gap-3 mb-4 cursor-pointer justify-center">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full">
                        <Image src="/google.png" width={18} height={18} alt="google" />
                    </div>
                    <p className="text-sm sm:text-base">Sign up with Google</p>
                </div>


                <div className="email mb-4">
                    <p className="mb-1 text-sm">Email Address</p>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="i.e. davon@gmail.com"
                        className="w-full p-2 rounded-full text-black border border-white text-sm"
                    />
                </div>


                <div className="first mb-4">
                    <p className="mb-1 text-sm">First & Last Name</p>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="i.e. David Leon"
                        className="w-full p-2 rounded-full text-black border border-white text-sm"
                    />
                </div>


                <div className="password mb-4">
                    <p className="mb-1 text-sm">Password</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2 rounded-full text-black border border-white text-sm"
                    />
                </div>


                <div className="checkbox flex items-center mb-4 text-sm">
                    <input type="checkbox" className="mr-2" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <p>Remember me</p>
                </div>


                <div onClick={handleSubmit} className="px-3 py-2 w-full sm:w-[60%] md:w-[50%] bg-black rounded-full text-center cursor-pointer mb-4 text-sm sm:text-base">
                    Create Account
                </div>


                {submit && (
                    <p className="text-sm mb-4 text-yellow-300">{submit}</p>
                )}


                <p className="text-sm">
                    Already have an account?{' '}
                    <span className="underline cursor-pointer text-black">Create free account</span>
                </p>
            </div>
        </section>
    )
}