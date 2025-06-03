"use client"

import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { enUS } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import type { DateRange } from "react-day-picker"

interface DatePickerWithRangeProps {
  date: DateRange
  setDate: (date: DateRange) => void
}

export function DatePickerWithRange({ date, setDate }: DatePickerWithRangeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn("w-[200px] justify-start text-left font-normal", !date?.from && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              `${format(date.from, "MMM dd, yyyy", { locale: enUS })} - ${format(date.to, "MMM dd, yyyy", {
                locale: enUS,
              })}`
            ) : (
              format(date.from, "MMM dd, yyyy", { locale: enUS })
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          selected={date && date.from ? date : undefined}
          defaultMonth={date?.from ? date.from : new Date()}
          onSelect={setDate}
          numberOfMonths={2}
          pagedNavigation
        />
      </PopoverContent>
    </Popover>
  )
}
