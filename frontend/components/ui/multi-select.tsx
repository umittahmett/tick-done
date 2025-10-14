'use client'

import * as React from 'react'
import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxCount?: number
  size?: 'sm' | 'default'
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select items...",
  className,
  disabled = false,
  maxCount = 3,
  size = 'default',
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleUnselect = (item: string) => {
    onValueChange(value.filter((i) => i !== item))
  }

  const handleSelect = (item: string) => {
    if (value.includes(item)) {
      handleUnselect(item)
    } else {
      onValueChange([...value, item])
      setOpen(false)
    }
  }

  const selectedOptions = options.filter((option) => value.includes(option.value))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between hover:bg-inherit text-left font-normal w-full",
            size === 'sm' ? 'min-h-8 h-auto' : 'min-h-10 h-auto',
            !value.length && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex gap-1 flex-wrap items-center py-1">
            {value.length === 0 && placeholder}
            {selectedOptions.length > 0 && selectedOptions.length <= maxCount && (
              selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "flex items-center gap-2 bg-secondary text-secondary-foreground rounded-md px-2 py-1 mr-1 mb-1",
                    size === 'sm' ? 'h-7 text-xs' : 'h-8 text-sm'
                  )}
                >
                  <Avatar className={cn(
                    size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
                  )}>
                    <AvatarFallback className={cn(
                      "bg-primary text-primary-foreground font-medium",
                      size === 'sm' ? 'text-[10px]' : 'text-xs'
                    )}>
                      {option.label.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate">{option.label}</span>
                  <div
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer hover:bg-secondary-foreground/10 p-0.5"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option.value)
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onClick={() => handleUnselect(option.value)}
                  >
                    <XIcon className={cn(
                      "text-muted-foreground hover:text-foreground",
                      size === 'sm' ? 'h-2 w-2' : 'h-3 w-3'
                    )} />
                  </div>
                </div>
              ))
            )}
            {selectedOptions.length > maxCount && (
              <div
                className={cn(
                  "flex items-center gap-2 bg-secondary text-secondary-foreground rounded-md px-2 py-1 mr-1 mb-1",
                  size === 'sm' ? 'h-7 text-xs' : 'h-8 text-sm'
                )}
              >
                <div className={cn(
                  "flex items-center justify-center bg-primary text-primary-foreground rounded-full font-medium",
                  size === 'sm' ? 'h-4 w-4 text-[10px]' : 'h-5 w-5 text-xs'
                )}>
                  {selectedOptions.length}
                </div>
                <span className="flex-1 truncate">selected</span>
              </div>
            )}
          </div>
          <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center gap-2"
                >
                  <CheckIcon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {option.label.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
