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
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
import { Webhook } from '@/lib/superbase/supabase.types'
import { Badge } from '@/components/ui/badge'
export default function Page() {
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook>()
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([])

  const router = useRouter()
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [folderId, setFolderId] = useState('')
  // const [webhookDetail, setWebhookDetail] = useState()
  const [webhookUrl, setWebhookUrl] = useState('')

  const searchParams = useSearchParams()

  const fetchWebhooks = async (id: string) => {
    if (!id) return []
    const response = await fetch(`/api/webhook?folder_id=${id}`)
    const data = await response.json()
    return data
  }

  useEffect(() => {
    const folder_id = searchParams.get('id')
    if (!folder_id) return
    fetchWebhooks(folder_id).then(data => {
      if (data) {
        setWebhooks(data.webhooks)
        setWebhookUrl(data.url)
      }
    })
  }, [searchParams])

  useEffect(() => {
    if (!folderId) return
    router.replace('?id=' + folderId)
    fetchWebhooks(folderId).then(data => {
      if (data) {
        setWebhooks(data.webhooks)
        setWebhookUrl(data.url)
      }
    })
  }, [folderId, router])

  useEffect(() => {
    console.log(webhooks)
  }, [webhooks])

  useEffect(() => {
    //console.log(selectedWebhook?.headers)

    if (selectedWebhook) {
      const headerData = JSON.parse(JSON.stringify(selectedWebhook?.headers))

      console.log(headerData)
      let heads: { key: string; value: string }[] = []
      for (const [key, value] of Object.entries(headerData)) {
        if (key == 'cookie' || key.startsWith('x-vercel')) continue
        heads.push({
          key: key,
          value: value as string,
        })
      }
      setHeaders(heads)
    }
  }, [selectedWebhook])

  // useEffect(() => {
  //   router.replace('?id=' + folderId)
  // }, [folderId])

  const handleSearch = () => {
    console.log(folderId)
    //router.replace(`?id=${folderId}`)
    fetchWebhooks(folderId as string).then(data => {
      if (data) {
        setWebhooks(data.webhooks)
        setWebhookUrl(data.url)
      }
    })
  }

  const onWebhookClick = async (tag: string) => {
    const response = await fetch(`/api/webhook/detail/${tag}`)
    const webhook = await response.json()
    setSelectedWebhook(webhook)
  }

  const createNewFolder = async () => {
    const data = await fetch(`/api/webhook`, {
      method: 'POST',
    })
    const folder = await data.json()
    setWebhookUrl(folder.url)
    setFolderId(folder.id)
    setWebhooks([])
  }

  const getBgColorMethod = (method: any) => {
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

    return bgMethodColor
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
            {webhooks && webhooks.length > 0 ? (
              webhooks.map(
                webhook =>
                  webhook && (
                    <div key={webhook.tag} className='flex flex-row mb-3'>
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
                  ),
              )
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
              <div className='text-foreground text-base font-medium'>
                Inbox ({webhooks?.length})
              </div>
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
          {webhooks?.length == 0 && (
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
          )}
          {selectedWebhook && (
            <div className='min-h-1/3 border-none h-screen'>
              <div className='flex flex-col gap-4'>
                <Card className='w-full'>
                  <CardHeader>Request Detail & Headers</CardHeader>
                  <CardContent className='m-2 flex flex-row sm:flex-col md:flex-row gap-2 p-4'>
                    <div className='w-1/2 flex flex-col gap-2 text-sm border-r-2'>
                      <div className='flex flex-row text-sm'>
                        <div className='w-[100px]'>
                          <Badge
                            className={`break-words ${getBgColorMethod(
                              selectedWebhook.method,
                            )}`}
                          >
                            {selectedWebhook.method}
                          </Badge>
                        </div>
                        <div className='ml-2'>
                          <p className='break-words text-black font-semibold'>
                            {selectedWebhook.url}
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-row text-sm'>
                        <div className='w-[100px]'>
                          <p className='break-words'>Host</p>
                        </div>
                        <div>
                          <p className='break-words text-black font-semibold'>
                            {selectedWebhook.client_ip}
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-row text-sm'>
                        <div className='w-[100px]'>
                          <p className='break-words'>Id</p>
                        </div>
                        <div>
                          <p className='break-words text-black font-semibold'>
                            {selectedWebhook.id}
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-row text-sm'>
                        <div className='w-[100px]'>
                          <p className='break-words'>Date</p>
                        </div>
                        <div>
                          <p className='break-words text-black font-semibold'>
                            {selectedWebhook.created_at}
                          </p>
                        </div>
                      </div>
                      <div className='flex flex-row text-sm'>
                        <div className='w-[100px]'>
                          <p className='break-words'>Tag</p>
                        </div>
                        <div>
                          <p className='break-words text-black font-semibold'>
                            {'#' + selectedWebhook.tag}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='w-1/2 '>
                      {headers.length > 0 &&
                        headers.map(m => (
                          <div
                            key={m.key}
                            className='grid grid-cols-2 mb-1 text-sm'
                          >
                            <div>
                              <p className='break-words'>{m.key + ':'}</p>
                            </div>
                            <div>
                              <p className='break-words text-black font-semibold'>
                                {m.value}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter className='m-2 flex flex-row sm:flex-col md:flex-row gap-2 p-4'>
                    <div className='w-2/5 flex flex-col gap-2 text-sm border-r-2'>
                      <div>Query string</div>
                      <div>
                        {selectedWebhook.query == '/'
                          ? '(empty)'
                          : selectedWebhook.query}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
                <Card className='w-full'>
                  <CardHeader>Body</CardHeader>
                  <CardContent className='flex justify-start items-center min-h-[200px] bg-neutral-300 m-4 rounded-sm'>
                    {JSON.stringify(selectedWebhook.body)}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
