'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useEffect, useRef } from 'react'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6 md:px-6">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-semibold text-foreground">
              Welcome to ChatBot
            </h2>
            <p className="text-muted-foreground">
              Start a conversation by typing a message below
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-xs font-semibold">AI</span>
                </div>
              )}

              <div
                className={`group max-w-xs gap-2 rounded-lg px-4 py-2 text-sm sm:max-w-md md:max-w-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                </ReactMarkdown>

                {/* <p className="whitespace-pre-wrap break-words">{message.content}</p> */}

                {message.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(message.content, message.id)}
                    className={`mt-2 flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                      copiedId === message.id
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : 'hover:bg-muted-foreground/10'
                    }`}
                    aria-label="Copy message"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>

              {message.role === 'user' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <span className="text-xs font-semibold">U</span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xs font-semibold">AI</span>
              </div>
              <div className="rounded-lg bg-muted px-4 py-2">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-foreground/60" />
                  <div className="animation-delay-200 h-2 w-2 animate-bounce rounded-full bg-foreground/60" />
                  <div className="animation-delay-400 h-2 w-2 animate-bounce rounded-full bg-foreground/60" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}
