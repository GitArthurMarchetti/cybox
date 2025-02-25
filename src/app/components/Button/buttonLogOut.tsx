import { DoLogout } from "@/app/services/login";
import { TbLogout2 } from "react-icons/tb";
import { motion } from "framer-motion";

export default function Logout() {
    return (
        <form action={DoLogout}>
            <motion.button
                type="submit"
                className="p-2 text-[#B4B4B4] hover:text-[#F6CF45]  transition-colors duration-300 rounded-full hover:bg-[#1F1F1F]"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                title="Sair"
            >
                <TbLogout2 className="text-xl cursor-pointer z-40" />
            </motion.button>
        </form>
    );
}