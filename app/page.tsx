import { auth } from '@/auth'

import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import AnimatedLogo from './global-components/AnimatedLogo';
import { getUserById } from '@/src/db/queries';
import { AvatarDropdown } from './global-components/AvatarDropdown';
import GlobalNavbar from './global-components/GlobalNavbar';

export default async function Component() {
  const session = await auth();
  const user = (await getUserById(session?.user.id as string))[0];

  return (
    <div className='min-h-screen bg-white divide-y divide-solid'>
      <GlobalNavbar {...user} />
      <div className='mx-16'>
        <div className='mt-32'>
          <h1 className='text-center font-display text-slate-900 text-6xl font-bold'>Practice <u>beyond</u> perfection</h1>
          <h4 className='mt-2 text-center font-heading text-slate-900 text-lg font-bold'>Level up your studying game.</h4>
          {
            session
              ?
              <Button className='w-48 mt-6 mx-auto' size="md" gradientDuoTone="tealToLime" href="./workspace">Go to workspace</Button>
              :
              <Button className='w-36 mt-6 mx-auto' size="md" gradientDuoTone="tealToLime" href="./api/auth/signin">Get Started</Button>
          }
        </div>
      </div>
    </div>
  );
}
