'use client'

import { Avatar, Dropdown } from "flowbite-react";

export function AvatarDropdown(user: {
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
        <Dropdown
            label={<Avatar alt="User settings" img={user.image as string} rounded />}
            arrowIcon={false}
            inline
        >
            <Dropdown.Header>
                <span className="block text-sm">{user.name as string}</span>
                <span className="block truncate text-sm font-medium">{user.email as string}</span>
            </Dropdown.Header>
            {/* <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item> */}
            <Dropdown.Divider />
            <Dropdown.Item
                href="./api/auth/signout"
            >Sign out</Dropdown.Item>
        </Dropdown>
    );
}
