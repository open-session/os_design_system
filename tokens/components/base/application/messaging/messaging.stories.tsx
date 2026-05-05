import type { Meta, StoryObj } from '@storybook/react';
import { MessageItem, MessageStatus, type Message } from './messaging';

const meta: Meta = {
  title: 'Base/Application/Messaging',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const incoming: Message = {
  id: '1',
  sentAt: '11:23 AM',
  user: { name: 'Olivia Rhye', avatarUrl: 'https://i.pravatar.cc/40?img=1', status: 'online' },
  text: 'Hey! How is the new pricing page coming along?',
};

const outgoing: Message = {
  id: '2',
  sentAt: '11:25 AM',
  status: 'read',
  user: { me: true, name: 'You' },
  text: 'Almost done — pushing a draft this afternoon.',
};

export const Conversation: Story = {
  render: () => (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      <MessageItem msg={incoming} />
      <MessageItem msg={outgoing} />
    </ul>
  ),
};

export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <MessageStatus status="sent" />
      <MessageStatus status="read" readAt="just now" />
      <MessageStatus status="failed" />
    </div>
  ),
};
