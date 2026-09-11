'use client'

import { Menu, Trash2 } from 'lucide-react'

interface ChatHeaderProps {
  title?: string
  onMenuClick: () => void
  onClearChat: () => void
}

export function ChatHeader({
  title = 'ChatBot',
  onMenuClick,
  onClearChat,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="flex-1 text-center text-lg font-semibold text-foreground lg:text-left">
        {title}
      </h1>

      <button
        onClick={onClearChat}
        className="rounded-lg p-2 hover:bg-muted"
        aria-label="Clear conversation"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )
}
