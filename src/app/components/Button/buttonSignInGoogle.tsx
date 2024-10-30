"use client"

import { doSocialLogin } from '@/app/services/login';
import { FcGoogle } from 'react-icons/fc';


export default function GoogleSingInButton() {
    return (
        <>
            <form action={doSocialLogin}>
                <button type="submit" name="action" value="google" className="bg-none border-2 border-[#F6CF45] w-full p-2 rounded-full" >
                    <FcGoogle className="m-auto 2xl:text-3xl"/>
                </button>
            </form>
        </>
    )
}