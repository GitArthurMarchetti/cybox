"use client"

import { doSocialLogin } from '@/app/services/login';
import { FcGoogle } from 'react-icons/fc';


export default function GoogleSingInButton() {
    return (
        <>
            <form action={doSocialLogin}>
                <button type="submit" name="action" value="google" className="bg-none border-2 border-[#F6CF45] text-black w-fit mx-auto  rounded-full 2xl:h-14 2xl:w-14 p-1  text-xl font-semibold items-center text-center justify-center m-auto" >
                    <FcGoogle className="m-auto 2xl:text-3xl" />
                </button>
            </form>
        </>
    )
}