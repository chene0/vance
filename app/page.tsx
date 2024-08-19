import { auth } from '@/auth'

import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { redirect } from 'next/navigation';

export default async function Component() {
  const session = await auth()
  if (session) redirect("./workspace")

  return (
    <Navbar fluid rounded>
      <NavbarBrand href="./">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Vance</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Button href="./api/auth/signin">Sign in with GitHub</Button>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="#" active>
          Home
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
