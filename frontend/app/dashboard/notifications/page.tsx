'use client'
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { api, Notification } from '@/lib/api'
import React, { useEffect, useState } from 'react'

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  async function fetchNotifications() {
    try {
      const userNotifications = await api.getUserNotifications(undefined, 'app', 60);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }

  useEffect(()=>{
    fetchNotifications()
  },[])

  return (
    <div className='container max-w-3xl py-6 sm:py-10'>
      <h1 className='text-2xl font-bold mb-4'>Notifications</h1>
      <div>
        {notifications && notifications.length > 0 ? notifications.map((notification) => (
            <Card className="flex flex-col gap-1.5 sm:gap-3 cursor-pointer !text-start relative pt-3 sm:pt-4 px-4 sm:px-6 pb-4 sm:pb-6" key={notification._id}>
              <time dateTime={notification.createdAt} className="text-xs text-muted-foreground mb-0.5 sm:mb-2">{new Date(notification.createdAt).toLocaleString()}</time>
              <CardTitle className='text-lg sm:text-xl'>{notification.subject}</CardTitle>
              <CardDescription className="text-muted-foreground">{notification.content}</CardDescription>
              {!notification.read && <div className="size-2 rounded-full bg-accent absolute top-2.5 right-2.5"></div> }
            </Card>
          )) : <div className="mx-auto w-fit text-sm py-4">No notifications</div>}
      </div>
    </div>
  )
}

export default NotificationsPage