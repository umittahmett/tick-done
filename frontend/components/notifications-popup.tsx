import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BellIcon } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function NotificationsPopup() {
  const { notifications } = useAuth()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <BellIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Notifications ({notifications?.length})</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {notifications && notifications.length > 0 ? notifications.map((notification) => (
            <DropdownMenuItem className="flex flex-col cursor-pointer hover:!bg-gray-900 !text-start relative" key={notification._id}>
              <div className="flex flex-col">
                <p className="font-semibold">{notification.subject}</p>
                <p className="text-sm mt-1 text-muted-foreground">{notification.content}</p>
              </div>
              {!notification.read && <div className="size-2 rounded-full bg-accent absolute top-1 right-1"></div> }
            </DropdownMenuItem>
          )) : <div className="mx-auto w-fit text-sm py-4">No notifications</div>}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
