// 'use client'

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useActionState } from 'react';
import { signIn } from "@/auth"

export default function Form() {
  // const [state, formAction] = useActionState(action, initialState)

  return (
    <form action={async (formData) => {
      "use server"
      await signIn("credentials", formData);
    }} className="flex max-w-md flex-col gap-4">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email2" value="Your email" />
        </div>
        <TextInput name="email" id="email2" type="email" placeholder="name@flowbite.com" required shadow />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password2" value="Your password" />
        </div>
        <TextInput name="password" id="password2" type="password" required shadow />
      </div>
      <Button type="submit">Log in</Button>
    </form>
  );
}
