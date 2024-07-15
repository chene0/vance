import { redirect } from "next/navigation";

export function signOut() {
    redirect("./api/auth/signout")
}