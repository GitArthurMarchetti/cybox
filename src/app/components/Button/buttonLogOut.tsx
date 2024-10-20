import { DoLogout } from "@/app/services/login";

export default function Logout() {
    return(
        <form action={DoLogout}>
            <button
            type="submit">
                Logout
            </button>
        </form>
    )

}