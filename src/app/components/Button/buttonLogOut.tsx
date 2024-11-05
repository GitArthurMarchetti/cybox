import { DoLogout } from "@/app/services/login";
import { TbLogout2 } from "react-icons/tb";

export default function Logout() {
    return(
        <form action={DoLogout}>
            <button
            type="submit">
                <TbLogout2 className="absolute top-3 right-3 2xl:text-xl" />
            </button>
        </form>
    )

}