import Sidebar from './Sidebar'
import { getUserById, updateUserById, } from '@/src/db/queries'
import { signOut } from '@/auth';
import { auth } from '@/auth'


export default async function Page() {
    const session = await auth()
    console.log("Session:", session)
    const user = await getUserById(session?.user.id as string)
    if (user[0].content === null) {
        updateUserById(user[0].id, {
            ...user[0], content: {
                "Physics": { "file1": "physics.pdf" },
                "file1": "spanish.pdf"
            }
        })
    }
    console.log("User:", user)

    const files = user[0].content;

    return (
        <div>
            <div>
                {JSON.stringify(user, null, 2)}
                <Sidebar files={await files} />
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