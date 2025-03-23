import clsx from 'clsx'
import React from 'react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
interface WebhookSidebarProps {
  eventId: string
  method: string
  host?: string
  isSelected?: boolean
  onClick?: () => void
  createAt?: string
  isRead: boolean
}

function WebhookSidebar({
  eventId,
  method,
  host,
  onClick,
  createAt,
  isRead,
  ...props
}: WebhookSidebarProps) {
  let bgMethodColor = ''

  switch (method) {
    case 'GET':
      bgMethodColor = 'bg-green-500'
      break
    case 'POST':
      bgMethodColor = 'bg-orange-300'
      break
    case 'PUT':
      bgMethodColor = 'bg-yellow-500'
      break
    case 'DELETE':
      bgMethodColor = 'bg-red-500'
      break
  }

  return (
    <div
      key={eventId}
      className={`flex flex-row p-2 w-full rounded-md cursor-pointer border hover:cursor-pointer
        ${
          isRead
            ? 'bg-gray-200 hover:bg-neutral-400'
            : ' bg-green-300 hover:bg-blue-300 hover:text-primary-foreground'
        }`}
      {...props}
      onClick={onClick}
    >
      <div className='flex w-full flex-col justify-between'>
        <div className='text-foreground text-base font-medium'>
          <Badge variant={'secondary'} className={clsx('', bgMethodColor)}>
            {method}
          </Badge>{' '}
          <span className='text-sm text-gray-500'>
            {'#' + eventId} {host}
          </span>
        </div>

        <div className='flex w-full items-center justify-between'>
          <div className='text-foreground text-base font-medium'></div>
          <Label className='flex items-center gap-2 text-sm font-thin'>
            <span>{createAt?.toLocaleString()}</span>
          </Label>
        </div>
      </div>
    </div>
  )
}

export default WebhookSidebar
