import clsx from 'clsx'
import React from 'react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
interface WebhookSidebarProps {
  clasName: string
  eventId: string
  method: string
  path: string
  isSelected?: boolean
  onClick?: () => void
  createAt?: Date
}

function WebhookSidebar({
  clasName,
  eventId,
  method,
  path,
  onClick,
  createAt,
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
    case 'POST':
      bgMethodColor = 'bg-red-500'
      break
  }

  return (
    <div
      key={eventId}
      className={clsx('w-full cursor-pointer', clasName)}
      {...props}
      onClick={onClick}
    >
      <div className='flex w-full flex-col justify-between'>
        <div className='text-foreground text-base font-medium'>
          <Badge variant={'secondary'} className={clsx('', bgMethodColor)}>
            {method}
          </Badge>{' '}
          <span className='text-sm text-gray-500'>{path || '/'}</span>
        </div>

        <div className='flex w-full items-center justify-between'>
          <div className='text-foreground text-base font-medium'>
            <Label className='flex items-center gap-2 text-sm cursor-pointer'>
              {'#' + eventId}
            </Label>
          </div>
          <Label className='flex items-center gap-2 text-sm font-thin'>
            <span>{createAt?.toLocaleString()}</span>
          </Label>
        </div>
      </div>
    </div>
  )
}

export default WebhookSidebar
