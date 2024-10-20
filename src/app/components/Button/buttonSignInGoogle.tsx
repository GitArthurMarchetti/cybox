"use client"

import { doSocialLogin } from '@/app/services/login';
import { FcGoogle } from 'react-icons/fc';


export default function GoogleSingInButton() {
    return (
        <>
            <form action={doSocialLogin}>
                <button type="submit" name="action" value="google" className="bg-none border-2 border-[#F6CF45] text-black w-fit mx-auto  rounded-full 2xl:h-14 2xl:py-0 p-2  text-xl font-semibold items-center text-center justify-center mt-2" >
                    <FcGoogle className="m-auto" />
                </button>
            </form>
        </>
    )
}