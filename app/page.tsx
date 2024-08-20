import { auth } from '@/auth'

import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { redirect } from 'next/navigation';
import AnimatedLogo from './AnimatedLogo';

export default async function Component() {
  const session = await auth()
  if (session) redirect("./workspace")

  return (
    <div className='min-h-screen bg-white'>
      <div className='mx-16'>
        <Navbar fluid rounded>
          <NavbarBrand href="./">
            <AnimatedLogo />
          </NavbarBrand>
          <div className="flex md:order-2">
            <Button pill href="./api/auth/signin">Sign in</Button>
            <NavbarToggle />
          </div>
          <NavbarCollapse>
            <NavbarLink className='text-center' href="#" active>
              Home
            </NavbarLink>
          </NavbarCollapse>
        </Navbar>
        <div className='mt-32'>
          <h1 className='text-center font-display text-slate-900 text-6xl font-bold'>Practice <u>beyond</u> perfection</h1>
          <h4 className='mt-2 text-center font-heading text-slate-900 text-lg font-bold'>Level up your studying game.</h4>
          <Button className='w-36 mt-6 mx-auto' size="md" gradientDuoTone="tealToLime" href="./api/auth/signin">Get Started</Button>
        </div>
      </div>
    </div>
  );
}
