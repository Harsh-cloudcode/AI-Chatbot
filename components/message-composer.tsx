'use client'

import { useRef, useEffect, useState } from 'react'
import { Send } from 'lucide-react'

interface MessageComposerProps {
  onSend: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

export function MessageComposer({
  onSend,
  isLoading,
  placeholder = 'Type a message...',
}: MessageComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useState('')

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = Math.min(
        textareaRef.current.scrollHeight,
        200 // max height of 8 lines
      )
      textareaRef.current.style.height = `${scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [value])

  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend(value)
      setValue('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for IME composition to avoid sending while composing CJK characters
    if (e.nativeEvent.isComposing) return

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-background p-4 md:p-6">
      <div className="flex gap-3 rounded-lg border border-border bg-card p-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          rows={1}
          aria-label="Message input"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="flex items-center justify-center rounded-lg bg-primary p-2 text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
