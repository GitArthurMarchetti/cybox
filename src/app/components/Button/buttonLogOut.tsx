import { DoLogout } from "@/app/actions";

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