import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ConnectorDropdown } from './connector-dropdown';

const meta: Meta<typeof ConnectorDropdown> = {
  title: 'Custom/Shared/Menus/ConnectorDropdown',
  component: ConnectorDropdown,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof ConnectorDropdown>;

function ConnectorDropdownStory() {
  const [open, setOpen] = useState(true);
  const [connectors, setConnectors] = useState([
    { id: 'gdrive', name: 'Google Drive', enabled: true, icon: 'fa-google-drive' },
    { id: 'notion', name: 'Notion', enabled: false, icon: 'fa-notion' },
  ]);
  return (
    <div className="relative h-96 p-6">
      <ConnectorDropdown
        isOpen={open}
        onClose={() => setOpen(false)}
        connectors={connectors as never}
        onToggleConnector={(id) =>
          setConnectors((cs) => cs.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)))
        }
      />
    </div>
  );
}

export const Open: Story = {
  render: () => <ConnectorDropdownStory />,
};
