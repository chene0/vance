'use client'

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useActionState } from 'react';
// import { signUp } from '@/app/lib/actions'

export default function Form() {
  // const [state, formAction] = useActionState(action, initialState)

  return (
    <div></div>
    // <form action={signUp} className="flex max-w-md flex-col gap-4">
    //   <div>
    //     <div className="mb-2 block">
    //       <Label htmlFor="username2" value="Your username" />
    //     </div>
    //     <TextInput name="username" id="username2" type="nickname" required shadow />
    //   </div>
    //   <div>
    //     <div className="mb-2 block">
    //       <Label htmlFor="email2" value="Your email" />
    //     </div>
    //     <TextInput name="email" id="email2" type="email" placeholder="name@flowbite.com" required shadow />
    //   </div>
    //   <div>
    //     <div className="mb-2 block">
    //       <Label htmlFor="password2" value="Your password" />
    //     </div>
    //     <TextInput name="password" id="password2" type="password" required shadow />
    //   </div>
    //   <div>
    //     <div className="mb-2 block">
    //       <Label htmlFor="repeat-password" value="Repeat password" />
    //     </div>
    //     <TextInput name="repeat-password" id="repeat-password" type="password" required shadow />
    //   </div>
    //   <div className="flex items-center gap-2">
    //     <Checkbox name="agree" id="agree" />
    //     <Label htmlFor="agree" className="flex">
    //       I agree with the&nbsp;
    //       <Link href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
    //         terms and conditions
    //       </Link>
    //     </Label>
    //   </div>
    //   <Button type="submit">Register new account</Button>
    // </form>
  );
}
