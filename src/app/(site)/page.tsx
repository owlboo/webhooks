'use client'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInput,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import WebhookSidebar from '@/components/webhook-sidebar'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [selectedWebhook, setSelectedWebhook] = useState(null)

  const router = useRouter()
  const [webhooks, setWebhooks] = useState([])
  const searchParams = useSearchParams()
  const folder_id = searchParams.get('id')
  const [folderId, setFolderId] = useState(folder_id)
  const [webhookDetail, setWebhookDetail] = useState({})
  const [webhookUrl, setWebhookUrl] = useState('')

  const fetchWebhooks = async (id: any) => {
    if (!id) return []
    const response = await fetch(`/api/webhook?folder_id=${id}`)
    const data = await response.json()
    return data
  }
  useEffect(() => {
    if (!folderId) return
    fetchWebhooks(folderId).then(data => {
      if (data) {
        setWebhooks(data.webhooks)
        setWebhookUrl(data.url)
      }
    })
  }, [])

  useEffect(() => {
    console.log(webhooks)
  }, [webhooks])

  useEffect(() => {
    console.log(selectedWebhook)
  }, [selectedWebhook])

  useEffect(() => {
    router.replace('?id=' + folderId)
  }, [folderId])

  const handleSearch = () => {
    console.log(folderId)
    //router.replace(`?id=${folderId}`)
    fetchWebhooks(folderId).then(data => {
      if (data) {
        setWebhooks(data.webhooks)
        setWebhookUrl(data.url)
      }
    })
  }

  const onWebhookClick = async (tag: string) => {
    var data = await fetch(`/api/webhook/${tag}`)

    var webhook = await data.json()
    console.log(webhook)
    setSelectedWebhook(webhook)
  }

  const createNewFolder = async () => {
    var data = await fetch(`/api/webhook`, {
      method: 'POST',
    })
    var folder = await data.json()
    setWebhookUrl(folder.url)
    setFolderId(folder.id)
    setWebhooks([])
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '450px',
        } as React.CSSProperties
      }
    >
      <AppSidebar
        sidebarContent={
          <>
            {webhooks?.length > 0 ? (
              webhooks.map((webhook, index) => (
                <div className='flex flex-row mb-3'>
                  <WebhookSidebar
                    clasName='flex flex-row bg-green-300 hover:bg-blue-300 hover:text-primary-foreground p-2 w-full rounded-md cursor-pointer border hover:cursor-pointer
                  '
                    method={webhook.method}
                    eventId={webhook.tag}
                    path={webhook.query}
                    createAt={webhook.created_at}
                    key={webhook.tag}
                    onClick={() => onWebhookClick(webhook.tag)}
                  ></WebhookSidebar>
                </div>
              ))
            ) : (
              <div className='flex justify-center mt-2 font-bold'>
                No Events
              </div>
            )}
          </>
        }
        sidebarHeader={
          <>
            <div className='flex w-full items-center justify-between'>
              <div className='text-foreground text-base font-medium'>Inbox</div>
              <Label className='flex items-center gap-2 text-sm'>
                <span>Unreads</span>
                <Switch className='shadow-none' />
              </Label>
            </div>
            <div className='flex flex-row gap-4 items-center mt-4'>
              <SidebarInput
                onChange={e => setFolderId(e.target.value)}
                placeholder='Search query ....'
              />
              <Button className='' size='sm' onClick={() => handleSearch()}>
                Search
              </Button>
            </div>
          </>
        }
      />
      <SidebarInset>
        <header className='bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Button onClick={() => createNewFolder()} className='ml-auto'>
            Create New
          </Button>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4'>
          {webhooks.length == 0 && (
            <>
              <div className='flex flex-col gap-4'>
                <Card className='min-h-full'>
                  <CardContent className='m-2 flex flex-row gap-2'>
                    <div className='w-full flex flex-col gap-2'>
                      <Label>Your unique URL</Label>
                      <span>{webhookUrl}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
          {selectedWebhook && (
            <>
              <div className='min-h-1/3 h-1/3 border-none'>
                <div className='flex flex-col gap-4'>
                  <Card>
                    <CardHeader>Request Detail & Headers</CardHeader>
                    <CardContent className='m-2 flex flex-row gap-2'>
                      <div className='w-1/2 flex flex-col gap-2'>
                        <div className='flex flex-row gap-5'>
                          <Label className='w-[50px] text-wrap text-sm'>
                            Host
                          </Label>
                          <div className=' text-sm'>
                            {selectedWebhook.client_ip}
                          </div>
                        </div>
                        <div className='flex flex-row gap-5'>
                          <Label className='w-[50px] text-wrap text-sm'>
                            Date
                          </Label>
                          <div className='text-sm'>
                            {selectedWebhook.created_at}
                          </div>
                        </div>
                        <div className='flex flex-row gap-5'>
                          <Label className='w-[50px] sm:[w-50] text-wrap text-sm'>
                            Id
                          </Label>
                          <div className='text-sm'>{selectedWebhook.id}</div>
                        </div>
                        <div className='flex flex-row gap-2'>
                          <Label className='w-[50px] text-wrap text-sm'>
                            Host
                          </Label>
                          <div className='text-sm'>
                            {selectedWebhook.client_ip}
                          </div>
                        </div>
                      </div>
                      <div className='w-1/2'>
                        <div>Request headers</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className='h-2/3 bg-gray-400 '></div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
