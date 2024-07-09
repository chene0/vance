import Sidebar from './Sidebar'
import { getUserById, getUserByName } from '@/src/db/queries'
import { signOut } from '@/auth';
import { getSession, useSession } from "next-auth/react"
import { auth } from '@/auth'

export default async function Page(){
    const session = await auth()
    console.log("Session:", session)
    const files = await session?.user.content
    console.log(await files)

    return (
        <div>
            <div>
                <Sidebar files={await files}/>
                <form
                    action={async () => {
                        'use server';
                        await signOut();
                    }}
                    >
                    <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                </form>
            </div>
        </div>
    )
}