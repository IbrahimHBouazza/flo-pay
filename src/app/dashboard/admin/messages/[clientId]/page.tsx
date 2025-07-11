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
  IconArrowLeft,
  IconDotsVertical,
  IconMoodSmile
} from '@tabler/icons-react';
import Link from 'next/link';

interface PageProps {
  params: {
    clientId: string;
  };
}

export default async function ClientMessagesPage({ params }: PageProps) {
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
        },
        {
          id: '4',
          content: 'Great! Let me know if you need any clarification.',
          sender: 'admin',
          timestamp: '2024-01-15T14:32:00Z',
          status: 'sent'
        },
        {
          id: '5',
          content: 'Will do. Thanks for your help!',
          sender: 'client',
          timestamp: '2024-01-15T14:35:00Z',
          status: 'read'
        }
      ],
      '2': [
        // TechStart Inc
        {
          id: '6',
          content: 'When can we schedule the next meeting?',
          sender: 'client',
          timestamp: '2024-01-15T12:15:00Z',
          status: 'read'
        },
        {
          id: '7',
          content: "I'm available tomorrow at 2 PM. Does that work for you?",
          sender: 'admin',
          timestamp: '2024-01-15T12:20:00Z',
          status: 'read'
        },
        {
          id: '8',
          content: "Perfect! I'll send you a calendar invite.",
          sender: 'client',
          timestamp: '2024-01-15T12:25:00Z',
          status: 'delivered'
        }
      ],
      '3': [
        // Global Solutions
        {
          id: '9',
          content: 'The financial report is ready for review.',
          sender: 'client',
          timestamp: '2024-01-15T10:45:00Z',
          status: 'delivered'
        },
        {
          id: '10',
          content:
            "Excellent! I'll review it and get back to you by end of day.",
          sender: 'admin',
          timestamp: '2024-01-15T10:50:00Z',
          status: 'sent'
        }
      ],
      '4': [
        // StartupXYZ
        {
          id: '11',
          content: 'We need help with the onboarding process.',
          sender: 'client',
          timestamp: '2024-01-14T16:20:00Z',
          status: 'read'
        },
        {
          id: '12',
          content: "I'll guide you through the onboarding steps.",
          sender: 'admin',
          timestamp: '2024-01-14T16:25:00Z',
          status: 'read'
        },
        {
          id: '13',
          content: 'Can you send us the checklist?',
          sender: 'client',
          timestamp: '2024-01-14T16:30:00Z',
          status: 'delivered'
        },
        {
          id: '14',
          content:
            "Of course! I'll send you a comprehensive checklist right away.",
          sender: 'admin',
          timestamp: '2024-01-14T16:35:00Z',
          status: 'sent'
        }
      ],
      '5': [
        // MegaCorp
        {
          id: '15',
          content: 'All tasks have been completed successfully.',
          sender: 'client',
          timestamp: '2024-01-14T15:30:00Z',
          status: 'read'
        },
        {
          id: '16',
          content: 'Fantastic! Great work on completing everything on time.',
          sender: 'admin',
          timestamp: '2024-01-14T15:35:00Z',
          status: 'read'
        }
      ],
      '6': [
        // SmallBiz Ltd
        {
          id: '17',
          content: 'Project closure documents submitted.',
          sender: 'client',
          timestamp: '2023-12-28T13:10:00Z',
          status: 'read'
        },
        {
          id: '18',
          content:
            "Thank you! I'll process the closure and send you confirmation.",
          sender: 'admin',
          timestamp: '2023-12-28T13:15:00Z',
          status: 'read'
        }
      ]
    };

    return messagesByClient[clientId as keyof typeof messagesByClient] || [];
  };

  const client = clients.find((c) => c.id === params.clientId);
  const messages = getClientMessages(params.clientId);

  if (!client) {
    return redirect('/dashboard/admin/messages');
  }

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
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <PageContainer>
      {/* Chat Interface */}
      <div className='bg-background flex-1 overflow-hidden rounded-lg border shadow-sm'>
        <div className='flex h-full min-h-0 flex-1 md:h-[calc(100vh-100px)]'>
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
              {clients.map((c) => {
                const clientMessages = getClientMessages(c.id);
                const lastMessage = clientMessages[clientMessages.length - 1];

                return (
                  <Link key={c.id} href={`/dashboard/admin/messages/${c.id}`}>
                    <div
                      className={`hover:bg-muted/50 border-border flex cursor-pointer items-center border-b p-4 transition-colors ${c.id === client.id ? 'bg-primary/10' : ''}`}
                    >
                      <div className='relative mr-3'>
                        <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full font-semibold'>
                          {c.avatar}
                        </div>
                        {c.online && (
                          <div className='border-background absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 bg-green-500'></div>
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='mb-1 flex items-center justify-between'>
                          <h3 className='text-foreground truncate font-medium'>
                            {c.name}
                          </h3>
                          <span className='text-muted-foreground text-xs'>
                            {formatTime(c.lastMessageTime)}
                          </span>
                        </div>
                        <div className='flex items-center justify-between'>
                          <p className='text-muted-foreground truncate text-sm'>
                            {c.lastMessage}
                          </p>
                          {c.unreadCount > 0 && (
                            <Badge className='bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs'>
                              {c.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <div className='mt-1 flex items-center gap-2'>
                          {getClientStatusBadge(c.status)}
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
                  <div className='relative'>
                    <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-semibold'>
                      {client.avatar}
                    </div>
                    {client.online && (
                      <div className='border-background absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 bg-green-500'></div>
                    )}
                  </div>
                  <div>
                    <h3 className='text-foreground font-semibold'>
                      {client.name}
                    </h3>
                    <div className='flex items-center gap-2'>
                      <p className='text-muted-foreground text-sm'>
                        {client.online ? 'Online' : 'Offline'}
                      </p>
                      {getClientStatusBadge(client.status)}
                    </div>
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
                {messages.length === 0 ? (
                  <div className='py-8 text-center'>
                    <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
                      <IconMessage className='text-primary h-8 w-8' />
                    </div>
                    <h3 className='text-foreground mb-2 text-lg font-medium'>
                      No messages yet
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      Start a conversation with {client.name}
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isAdmin = message.sender === 'admin';
                    const showDate =
                      index === 0 ||
                      formatDate(message.timestamp) !==
                        formatDate(messages[index - 1]?.timestamp);

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className='mb-4 text-center'>
                            <span className='bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs'>
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                        )}
                        <div
                          className={`flex ${isAdmin ? 'justify-end' : 'justify-start'} mb-2`}
                        >
                          <div
                            className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                              isAdmin
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-background text-foreground border-border border'
                            }`}
                          >
                            <p className='text-sm'>{message.content}</p>
                            <div
                              className={`mt-1 flex items-center justify-end gap-1 ${
                                isAdmin
                                  ? 'text-primary-foreground/70'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              <span className='text-xs'>
                                {formatTime(message.timestamp)}
                              </span>
                              {isAdmin && getMessageStatusIcon(message.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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
    </PageContainer>
  );
}
