'use client'

import * as React from 'react'
import { ArchiveX, Command, File, Inbox, Send, Trash2 } from 'lucide-react'

import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

// This is sample data
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Inbox',
      url: '#',
      icon: Inbox,
      isActive: true,
    },
    {
      title: 'Drafts',
      url: '#',
      icon: File,
      isActive: false,
    },
    {
      title: 'Sent',
      url: '#',
      icon: Send,
      isActive: false,
    },
    {
      title: 'Junk',
      url: '#',
      icon: ArchiveX,
      isActive: false,
    },
    {
      title: 'Trash',
      url: '#',
      icon: Trash2,
      isActive: false,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sidebarContent?: React.ReactNode
  sidebarHeader?: React.ReactNode
}

export function AppSidebar({
  sidebarContent,
  sidebarHeader,
  ...props
}: AppSidebarProps) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [mails, setMails] = React.useState(data.mails)
  const { setOpen } = useSidebar()

  return (
    <Sidebar
      collapsible='icon'
      className='overflow-hidden *:data-[sidebar=sidebar]:flex-row'
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible='none'
        className='w-[calc(var(--sidebar-width-icon)+1px)]! border-r'
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' asChild className='md:h-8 md:p-0'>
                <a href='#'>
                  <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                    <Command className='size-4' />
                  </div>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>Acme Inc</span>
                    <span className='truncate text-xs'>Enterprise</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className='px-1.5 md:px-0'>
              <SidebarMenu>
                {data.navMain.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        const mail = data.mails.sort(() => Math.random() - 0.5)
                        setMails(
                          mail.slice(
                            0,
                            Math.max(5, Math.floor(Math.random() * 10) + 1),
                          ),
                        )
                        setOpen(true)
                      }}
                      isActive={activeItem?.title === item.title}
                      className='px-2.5 md:px-2'
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar
        collapsible='offcanvas'
        className='hidden flex-1 md:flex w-[calc(40% -var(--sidebar-width-icon))]!'
      >
        <SidebarHeader className='gap-3.5 border-b p-4'>
          {sidebarHeader}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className='px-0'>
            <SidebarGroupContent className='px-2'>
              {sidebarContent}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
