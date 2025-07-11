import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isUserAdmin } from '@/lib/auth';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  IconMessage,
  IconSearch,
  IconSend,
  IconPaperclip,
  IconPhone,
  IconVideo,
  IconBuilding,
  IconUser,
  IconCheck,
  IconClock,
  IconDots,
  IconDotsVertical,
  IconMoodSmile
} from '@tabler/icons-react';
import Link from 'next/link';

export default async function AdminMessagesPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    return redirect('/dashboard/overview');
  }

  // Mock clients data - in a real app, this would come from the database
  const clients = [
    {
      id: '1',
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      status: 'active',
      avatar: 'AC',
      lastMessage: "Thank you for the documents. I'll review them today.",
      lastMessageTime: '2024-01-15T14:30:00Z',
      unreadCount: 2,
      online: true
    },
    {
      id: '2',
      name: 'TechStart Inc',
      email: 'hello@techstart.com',
      status: 'active',
      avatar: 'TI',
      lastMessage: 'When can we schedule the next meeting?',
      lastMessageTime: '2024-01-15T12:15:00Z',
      unreadCount: 0,
      online: false
    },
    {
      id: '3',
      name: 'Global Solutions',
      email: 'info@globalsolutions.com',
      status: 'active',
      avatar: 'GS',
      lastMessage: 'The financial report is ready for review.',
      lastMessageTime: '2024-01-15T10:45:00Z',
      unreadCount: 1,
      online: true
    },
    {
      id: '4',
      name: 'StartupXYZ',
      email: 'team@startupxyz.com',
      status: 'pending',
      avatar: 'SX',
      lastMessage: 'We need help with the onboarding process.',
      lastMessageTime: '2024-01-14T16:20:00Z',
      unreadCount: 3,
      online: false
    },
    {
      id: '5',
      name: 'MegaCorp',
      email: 'admin@megacorp.com',
      status: 'active',
      avatar: 'MC',
      lastMessage: 'All tasks have been completed successfully.',
      lastMessageTime: '2024-01-14T15:30:00Z',
      unreadCount: 0,
      online: true
    },
    {
      id: '6',
      name: 'SmallBiz Ltd',
      email: 'contact@smallbiz.com',
      status: 'inactive',
      avatar: 'SB',
      lastMessage: 'Project closure documents submitted.',
      lastMessageTime: '2023-12-28T13:10:00Z',
      unreadCount: 0,
      online: false
    }
  ];

  // Mock messages data - in a real app, this would come from the database
  const getClientMessages = (clientId: string) => {
    const messagesByClient = {
      '1': [
        // Acme Corporation
        {
          id: '1',
          content: 'Hello! I need help with uploading the Q4 tax documents.',
          sender: 'client',
          timestamp: '2024-01-15T14:25:00Z',
          status: 'read'
        },
        {
          id: '2',
          content:
            'Hi! I can help you with that. Please upload the documents through the portal.',
          sender: 'admin',
          timestamp: '2024-01-15T14:28:00Z',
          status: 'read'
        },
        {
          id: '3',
          content: "Thank you for the documents. I'll review them today.",
          sender: 'client',
          timestamp: '2024-01-15T14:30:00Z',
          status: 'delivered'
        }
      ],
      '2': [
        // TechStart Inc
        {
          id: '4',
          content: 'When can we schedule the next meeting?',
          sender: 'client',
          timestamp: '2024-01-15T12:15:00Z',
          status: 'read'
        }
      ],
      '3': [
        // Global Solutions
        {
          id: '5',
          content: 'The financial report is ready for review.',
          sender: 'client',
          timestamp: '2024-01-15T10:45:00Z',
          status: 'delivered'
        }
      ],
      '4': [
        // StartupXYZ
        {
          id: '6',
          content: 'We need help with the onboarding process.',
          sender: 'client',
          timestamp: '2024-01-14T16:20:00Z',
          status: 'read'
        },
        {
          id: '7',
          content: "I'll guide you through the onboarding steps.",
          sender: 'admin',
          timestamp: '2024-01-14T16:25:00Z',
          status: 'read'
        },
        {
          id: '8',
          content: 'Can you send us the checklist?',
          sender: 'client',
          timestamp: '2024-01-14T16:30:00Z',
          status: 'delivered'
        }
      ],
      '5': [
        // MegaCorp
        {
          id: '9',
          content: 'All tasks have been completed successfully.',
          sender: 'client',
          timestamp: '2024-01-14T15:30:00Z',
          status: 'read'
        }
      ],
      '6': [
        // SmallBiz Ltd
        {
          id: '10',
          content: 'Project closure documents submitted.',
          sender: 'client',
          timestamp: '2023-12-28T13:10:00Z',
          status: 'read'
        }
      ]
    };

    return messagesByClient[clientId as keyof typeof messagesByClient] || [];
  };

  const getClientStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      inactive: 'outline'
    } as const;

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || 'outline'}
        className='text-xs'
      >
        {status}
      </Badge>
    );
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <IconCheck className='h-3 w-3 text-gray-400' />;
      case 'delivered':
        return <IconCheck className='h-3 w-3 text-gray-400' />;
      case 'read':
        return <IconCheck className='h-3 w-3 text-blue-500' />;
      default:
        return <IconClock className='h-3 w-3 text-gray-400' />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-6'>
        {/* Messages Interface */}
        <div className='bg-background flex-1 overflow-hidden rounded-lg border shadow-sm'>
          <div className='flex h-[calc(100vh-280px)]'>
            {/* Sidebar - Client List */}
            <div className='border-border flex w-80 flex-col border-r'>
              {/* Search Header */}
              <div className='border-border bg-muted/50 border-b p-4'>
                <div className='relative'>
                  <IconSearch className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                  <Input
                    placeholder='Search clients...'
                    className='bg-background pl-10'
                  />
                </div>
              </div>

              {/* Client List */}
              <div className='flex-1 overflow-y-auto'>
                {clients.map((client) => {
                  const messages = getClientMessages(client.id);
                  const lastMessage = messages[messages.length - 1];

                  return (
                    <Link
                      key={client.id}
                      href={`/dashboard/admin/messages/${client.id}`}
                    >
                      <div className='hover:bg-muted/50 border-border flex cursor-pointer items-center border-b p-4 transition-colors'>
                        <div className='relative mr-3'>
                          <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full font-semibold'>
                            {client.avatar}
                          </div>
                          {client.online && (
                            <div className='border-background absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 bg-green-500'></div>
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='mb-1 flex items-center justify-between'>
                            <h3 className='text-foreground truncate font-medium'>
                              {client.name}
                            </h3>
                            <span className='text-muted-foreground text-xs'>
                              {formatTime(client.lastMessageTime)}
                            </span>
                          </div>
                          <div className='flex items-center justify-between'>
                            <p className='text-muted-foreground truncate text-sm'>
                              {client.lastMessage}
                            </p>
                            {client.unreadCount > 0 && (
                              <Badge className='bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs'>
                                {client.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <div className='mt-1 flex items-center gap-2'>
                            {getClientStatusBadge(client.status)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className='flex flex-1 flex-col'>
              {/* Chat Header */}
              <div className='border-border bg-background border-b p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-semibold'>
                      AC
                    </div>
                    <div>
                      <h3 className='text-foreground font-semibold'>
                        Acme Corporation
                      </h3>
                      <p className='text-muted-foreground text-sm'>Active</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button variant='ghost' size='sm'>
                      <IconPhone className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='sm'>
                      <IconVideo className='h-4 w-4' />
                    </Button>
                    <Button variant='ghost' size='sm'>
                      <IconDotsVertical className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className='bg-muted/30 flex-1 overflow-y-auto p-4'>
                <div className='space-y-4'>
                  {/* Welcome Message */}
                  <div className='py-8 text-center'>
                    <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                      <IconMessage className='text-primary h-8 w-8' />
                    </div>
                    <h3 className='text-foreground mb-2 text-lg font-medium'>
                      Welcome to Messages
                    </h3>
                    <p className='text-muted-foreground mb-4 text-sm'>
                      Select a client from the sidebar to start messaging
                    </p>
                    <div className='text-muted-foreground flex items-center justify-center gap-2 text-xs'>
                      <IconCheck className='h-3 w-3' />
                      <span>End-to-end encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className='border-border bg-background border-t p-4'>
                <div className='flex items-center gap-2'>
                  <Button variant='ghost' size='sm'>
                    <IconPaperclip className='h-4 w-4' />
                  </Button>
                  <div className='relative flex-1'>
                    <Input placeholder='Type a message...' className='pr-20' />
                    <Button
                      variant='ghost'
                      size='sm'
                      className='absolute top-1/2 right-2 -translate-y-1/2 transform'
                    >
                      <IconMoodSmile className='h-4 w-4' />
                    </Button>
                  </div>
                  <Button
                    size='sm'
                    className='bg-primary hover:bg-primary/90 text-primary-foreground'
                  >
                    <IconSend className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
