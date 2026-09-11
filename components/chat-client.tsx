
'use client'

import { useState, useCallback } from 'react'
import { ChatSidebar } from './chat-sidebar'
import { ChatHeader } from './chat-header'
import { MessageList, Message } from './message-list'
import { MessageComposer } from './message-composer'

interface ChatSession {
  id: string
  title: string
  date: string
  messages: Message[]
}

export function ChatClient() {
  const initialChatId = 'chat-initial'

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [currentChatId, setCurrentChatId] = useState<string | null>(
    initialChatId
  )

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: initialChatId,
      title: 'New Chat',
      date: 'today',
      messages: [],
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  const currentChat = chatSessions.find(
    (chat) => chat.id === currentChatId
  )

  const generateChatTitle = (firstMessage: string) => {
    if (firstMessage.length > 50) {
      return firstMessage.slice(0, 50) + '...'
    }

    return firstMessage
  }

  const createNewChat = useCallback(() => {
    const newChatId = 'chat-' + Date.now()

    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Chat',
      date: 'today',
      messages: [],
    }

    setChatSessions((prev) => [newChat, ...prev])
    setCurrentChatId(newChatId)
    setSidebarOpen(false)
  }, [])

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) {
        return
      }

      const chatId =
        currentChatId || 'chat-' + Date.now()

      const userMessage: Message = {
        id: 'msg-' + Date.now(),
        content: content,
        role: 'user',
        timestamp: new Date(),
      }

      setChatSessions((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) {
            return chat
          }

          const updatedChat = {
            ...chat,
            messages: [...chat.messages, userMessage],
          }

          if (chat.title === 'New Chat') {
            updatedChat.title = generateChatTitle(content)
          }

          return updatedChat
        })
      )

      setIsLoading(true)

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL

        console.log('API URL:', apiUrl)

        if (!apiUrl) {
          throw new Error(
            'NEXT_PUBLIC_API_URL is missing. Check your .env.local file.'
          )
        }

        const response = await fetch(
          apiUrl + '/chat',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: content,
            }),
          }
        )

        if (!response.ok) {
          throw new Error(
            'Backend returned status ' + response.status
          )
        }

        const data = await response.json()

        console.log('Backend response:', data)

        const assistantMessage: Message = {
          id: 'msg-' + Date.now() + '-assistant',
          content: data.response,
          role: 'assistant',
          timestamp: new Date(),
        }

        setChatSessions((prev) =>
          prev.map((chat) => {
            if (chat.id !== chatId) {
              return chat
            }

            return {
              ...chat,
              messages: [
                ...chat.messages,
                assistantMessage,
              ],
            }
          })
        )
      } catch (error) {
        console.error('Chat API error:', error)

        const errorText =
          error instanceof Error
            ? error.message
            : 'Unable to connect to the backend.'

        const errorMessage: Message = {
          id: 'msg-' + Date.now() + '-error',
          content: 'Error: ' + errorText,
          role: 'assistant',
          timestamp: new Date(),
        }

        setChatSessions((prev) =>
          prev.map((chat) => {
            if (chat.id !== chatId) {
              return chat
            }

            return {
              ...chat,
              messages: [
                ...chat.messages,
                errorMessage,
              ],
            }
          })
        )
      } finally {
        setIsLoading(false)
      }
    },
    [currentChatId]
  )

  const handleSelectChat = useCallback(
    (id: string) => {
      setCurrentChatId(id)
      setSidebarOpen(false)
    },
    []
  )

  const handleDeleteChat = useCallback(
    (id: string) => {
      setChatSessions((prev) =>
        prev.filter((chat) => chat.id !== id)
      )

      if (currentChatId === id) {
        const remainingChats = chatSessions.filter(
          (chat) => chat.id !== id
        )

        if (remainingChats.length > 0) {
          setCurrentChatId(remainingChats[0].id)
        } else {
          setCurrentChatId(null)
        }
      }
    },
    [currentChatId, chatSessions]
  )

  const handleClearChat = useCallback(() => {
    if (!currentChatId) {
      return
    }

    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id !== currentChatId) {
          return chat
        }

        return {
          ...chat,
          messages: [],
        }
      })
    )
  }, [currentChatId])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar
        chatHistory={chatSessions.map((chat) => ({
          id: chat.id,
          title: chat.title,
          date: chat.date,
        }))}
        onNewChat={createNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        currentChatId={currentChatId ?? undefined}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <ChatHeader
          title={currentChat?.title || 'ChatBot'}
          onMenuClick={() => setSidebarOpen(true)}
          onClearChat={handleClearChat}
        />

        <MessageList
          messages={currentChat?.messages || []}
          isLoading={isLoading}
        />

        <MessageComposer
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

