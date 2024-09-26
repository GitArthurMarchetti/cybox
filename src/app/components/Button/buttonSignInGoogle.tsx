"use client"
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc';


export default function GoogleSingInButton() {
    return (
        <>
            <button onClick={() =>signIn('google')} className="bg-none border-2 border-[#F6CF45] text-black w-fit mx-auto  rounded-full 2xl:h-14 2xl:py-0 p-2  text-xl font-semibold items-center text-center justify-center mt-2" >
                <FcGoogle className="m-auto" />
            </button>
        </>
    )
}