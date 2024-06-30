import Sidebar from './Sidebar'
import { getUserById } from '@/src/db/queries'

export default async function Page(){
    const user = await getUserById(1)
    const files = await user[0].content.files

    return (
        <div>
            <div>
                <Sidebar files={await files}/>
            </div>
        </div>
    )
}