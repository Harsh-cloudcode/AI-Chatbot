'use client'

import { useState } from 'react'
import { Plus, Trash2, Search, X } from 'lucide-react'

interface ChatItem {
  id: string
  title: string
  date: string
}

interface ChatSidebarProps {
  chatHistory: ChatItem[]
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  currentChatId?: string
  isOpen?: boolean
  onClose?: () => void
}

export function ChatSidebar({
  chatHistory,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  currentChatId,
  isOpen = true,
  onClose,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedChats = {
    today: filteredChats.filter(c => c.date === 'today'),
    yesterday: filteredChats.filter(c => c.date === 'yesterday'),
    earlier: filteredChats.filter(c => c.date === 'earlier'),
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
          <h1 className="text-lg font-semibold text-sidebar-foreground">Chats</h1>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-sidebar-accent lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="m-3 flex items-center gap-2 rounded-lg bg-sidebar-primary px-4 py-2 font-medium text-sidebar-primary-foreground transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>

        {/* Search */}
        <div className="relative mx-3 mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-accent-foreground" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-sidebar-border bg-sidebar px-3 py-2 pl-9 text-sm text-sidebar-foreground placeholder:text-sidebar-accent-foreground focus:border-sidebar-ring focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
          />
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-2">
          {chatHistory.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-sm text-sidebar-accent-foreground">
                No chats yet. Start a new conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedChats.today.length > 0 && (
                <div>
                  <h3 className="px-2 py-2 text-xs font-medium uppercase text-sidebar-accent-foreground">
                    Today
                  </h3>
                  <div className="space-y-1">
                    {groupedChats.today.map(chat => (
                      <div
                        key={chat.id}
                        onMouseEnter={() => setHoveredId(chat.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${
                          currentChatId === chat.id
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }`}
                      >
                        <button
                          onClick={() => onSelectChat(chat.id)}
                          className="flex-1 truncate text-left"
                        >
                          {chat.title}
                        </button>
                        {hoveredId === chat.id && (
                          <button
                            onClick={() => onDeleteChat(chat.id)}
                            className="rounded p-1 hover:bg-sidebar-border"
                            aria-label="Delete chat"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {groupedChats.yesterday.length > 0 && (
                <div>
                  <h3 className="px-2 py-2 text-xs font-medium uppercase text-sidebar-accent-foreground">
                    Yesterday
                  </h3>
                  <div className="space-y-1">
                    {groupedChats.yesterday.map(chat => (
                      <div
                        key={chat.id}
                        onMouseEnter={() => setHoveredId(chat.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${
                          currentChatId === chat.id
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }`}
                      >
                        <button
                          onClick={() => onSelectChat(chat.id)}
                          className="flex-1 truncate text-left"
                        >
                          {chat.title}
                        </button>
                        {hoveredId === chat.id && (
                          <button
                            onClick={() => onDeleteChat(chat.id)}
                            className="rounded p-1 hover:bg-sidebar-border"
                            aria-label="Delete chat"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {groupedChats.earlier.length > 0 && (
                <div>
                  <h3 className="px-2 py-2 text-xs font-medium uppercase text-sidebar-accent-foreground">
                    Earlier
                  </h3>
                  <div className="space-y-1">
                    {groupedChats.earlier.map(chat => (
                      <div
                        key={chat.id}
                        onMouseEnter={() => setHoveredId(chat.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors ${
                          currentChatId === chat.id
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }`}
                      >
                        <button
                          onClick={() => onSelectChat(chat.id)}
                          className="flex-1 truncate text-left"
                        >
                          {chat.title}
                        </button>
                        {hoveredId === chat.id && (
                          <button
                            onClick={() => onDeleteChat(chat.id)}
                            className="rounded p-1 hover:bg-sidebar-border"
                            aria-label="Delete chat"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-accent-foreground">
          <p>ChatBot v1.0</p>
        </div>
      </aside>
    </>
  )
}
