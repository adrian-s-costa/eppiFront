import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectComponent({ setMode }: any) {
  return (
    <Select onValueChange={(e)=>{setMode(e)}}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Trocar modo" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Datas</SelectLabel>
          <SelectItem value="fixo">Fixas</SelectItem>
          <SelectItem value="especifico">Especifícas</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
