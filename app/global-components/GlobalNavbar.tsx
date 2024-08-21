import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import AnimatedLogo from "./AnimatedLogo";
import { AvatarDropdown } from "./AvatarDropdown";

export default function GlobalNavbar(user: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    pw: string | null;
    image: string | null;
    content: any;
    misc: any;
}) {
    return (
        <Navbar fluid>
            <NavbarBrand href="./">
                <AnimatedLogo />
            </NavbarBrand>
            <div className="flex md:order-2">
                {user
                    ?
                    <AvatarDropdown {...user} />
                    :
                    <Button pill href="./api/auth/signin">Sign in</Button>}

                <NavbarToggle />
            </div>
            <NavbarCollapse>
                <NavbarLink className='text-center' href="./" active>
                    Home
                </NavbarLink>
                <NavbarLink className='text-center' href="./workspace" active>
                    Workspace
                </NavbarLink>
            </NavbarCollapse>
        </Navbar>
    )
}
