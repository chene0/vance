import Sidebar from './Sidebar'
import { getUserById, updateUserById, } from '@/src/db/queries'
import { auth } from '@/auth'
import Wrapper from './Container';
import { signOut } from '@/auth';

export default async function Page() {
    const session = await auth()
    console.log("Session:", session)
    const user = await getUserById(session?.user.id as string)
    console.log("User:", user)

    const files = await user[0].content;
    console.log("🚀 ~ Page ~ files:", files)


    return (
        <div>
            <Wrapper user={await user} />
        </div>
    )
}