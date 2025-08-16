import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import React from "react"

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"

export default function PasswordInput({ setPasswordInfo, passwordInfo, specificVar }: any) {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size='md'>
      <Input
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Digite a senha'
        onChange={(event)=>{setPasswordInfo({ ...passwordInfo, [specificVar]: event.target.value })}}
        required
      />
      <InputRightElement width='3rem' className="h-full">
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? <IoEyeOffOutline className="text-xl text-black dark:text-black"/> : <IoEyeOutline className="text-xl text-black dark:text-black"/>}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}