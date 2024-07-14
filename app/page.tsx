
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";

export default function Component() {
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
        <NavbarLink href="#">About</NavbarLink>
        <NavbarLink href="#">Services</NavbarLink>
        <NavbarLink href="#">Pricing</NavbarLink>
        <NavbarLink href="#">Contact</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
