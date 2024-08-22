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
    console.log("🚀 ~ user:", user)

    return (
        <Navbar fluid className="relative">
            <NavbarBrand href="./">
                <AnimatedLogo />
            </NavbarBrand>
            <div className="flex md:order-2">
                {Object.keys(user).length > 0
                    ?
                    <AvatarDropdown {...user} />
                    :
                    <Button pill href="./api/auth/signin">Sign in</Button>}

                <NavbarToggle />
            </div>
            <NavbarCollapse className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
