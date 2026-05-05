'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Clock, MessageSquare01, XClose } from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';
import { useChatContext } from '@/lib/chat-context';
import type { ProjectChat } from '@/lib/supabase/projects-service';

interface ProjectChatListProps {
  chats: ProjectChat[];
  projectId: string;
  onRemoveChat?: (chatId: string) => void;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ProjectChatList({ chats, projectId, onRemoveChat }: ProjectChatListProps) {
  const router = useRouter();
  const { loadSession } = useChatContext();

  const handleChatClick = (chatId: string) => {
    loadSession(chatId);
    router.push('/chat');
  };

  if (chats.length === 0) {
    return (
      <div {...devProps('ProjectChatList')} className="
        flex flex-col items-center justify-center
        py-12 px-4
        text-center
      ">
        <div className="
          w-12 h-12 mb-3
          rounded-full
          bg-bg-tertiary
          flex items-center justify-center
        ">
          <MessageSquare01 className="w-6 h-6 text-fg-quaternary" />
        </div>
        <p className="text-sm text-fg-tertiary mb-1">
          No conversations yet
        </p>
        <p className="text-xs text-fg-quaternary">
          Start a conversation to add it to this project
        </p>
      </div>
    );
  }

  return (
    <div {...devProps('ProjectChatList')} className="divide-y divide-border-secondary">
      {chats.map((chat, index) => (
        <motion.div
          key={chat.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.03 }}
        >
          <button
            onClick={() => handleChatClick(chat.id)}
            className="
              w-full
              flex items-start gap-3
              px-4 py-3
              text-left
              hover:bg-bg-tertiary
              transition-colors
              group
            "
          >
            {/* Icon */}
            <div className="
              w-8 h-8 mt-0.5
              rounded-lg
              bg-bg-tertiary
              group-hover:bg-bg-quaternary
              flex items-center justify-center
              flex-shrink-0
              transition-colors
            ">
              <MessageSquare01 className="w-4 h-4 text-fg-tertiary" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-fg-primary truncate">
                {chat.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-fg-tertiary">
                <Clock className="w-3 h-3" />
                <span>Last message {chat.updated_at ? formatRelativeTime(chat.updated_at) : 'Unknown'}</span>
              </div>
            </div>

            {/* Remove button - visible on hover */}
            {onRemoveChat && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveChat(chat.id);
                }}
                className="
                  p-1.5 rounded-md
                  text-fg-quaternary
                  hover:text-fg-error-primary
                  hover:bg-bg-error-primary
                  opacity-0 group-hover:opacity-100
                  transition-all
                "
                title="Remove from project"
              >
                <XClose className="w-4 h-4" />
              </button>
            )}
          </button>
        </motion.div>
      ))}
    </div>
  );
}
