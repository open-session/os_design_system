'use client';

import { devProps } from '@/lib/utils/dev-props';
import { FeatureCard } from '../primitives/FeatureCard';
import { FeatureCarousel } from '../primitives/FeatureCarousel';
import { SortableGroup } from '../primitives/SortableGroup';
import { SortableItem } from '../primitives/SortableItem';
import { ProductDemoVisual } from '../visuals/ProductDemoVisual';
import { BrandMcpVisual } from '../visuals/BrandMcpVisual';
import { BrandVoiceVisual } from '../visuals/BrandVoiceVisual';
import { StyleTokensVisual } from '../visuals/StyleTokensVisual';
import { WorkflowsVisual } from '../visuals/WorkflowsVisual';
import { SharedSpacesVisual } from '../visuals/SharedSpacesVisual';
import { SocialConnectVisual } from '../visuals/SocialConnectVisual';
import { WorkspaceConnectVisual } from '../visuals/WorkspaceConnectVisual';
import { useHomeLayoutStore } from '@/stores/home-layout-store';
import { FEATURES_ITEM_IDS, HOME_SECTION_IDS } from '../layout-config';

const FEATURE_BY_ID = {
  [FEATURES_ITEM_IDS.PRODUCT_DEMO]: {
    variant: 'aperol' as const,
    title: 'Full product demo',
    index: '001',
    caption: 'Watch a short walkthrough of BOS.',
    visual: <ProductDemoVisual />,
  },
  [FEATURES_ITEM_IDS.BRAND_MCP]: {
    variant: 'vanilla' as const,
    title: 'Brand MCP',
    index: '002',
    caption: 'Bring your brand context into any coding tool, builder, or Claude.',
    visual: <BrandMcpVisual />,
  },
  [FEATURES_ITEM_IDS.BRAND_VOICE]: {
    variant: 'vanilla' as const,
    title: 'Build your brand voice',
    index: '003',
    caption: 'Refine your voice with Remy from guidelines, site, and launches.',
    visual: <BrandVoiceVisual />,
  },
  [FEATURES_ITEM_IDS.STYLE_TOKENS]: {
    variant: 'vanilla' as const,
    title: 'Generate Style Tokens',
    index: '004',
    caption: 'Turn your brand into a portable Tailwind config.',
    visual: <StyleTokensVisual />,
  },
  [FEATURES_ITEM_IDS.WORKFLOWS]: {
    variant: 'vanilla' as const,
    title: 'Visual Workflows',
    index: '005',
    caption: 'Node-based builder for design and marketing workflows.',
    visual: <WorkflowsVisual />,
  },
  [FEATURES_ITEM_IDS.SHARED_SPACES]: {
    variant: 'vanilla' as const,
    title: 'Shared Spaces',
    index: '006',
    caption: 'Collaborative rooms for campaigns, launches, and projects.',
    visual: <SharedSpacesVisual />,
  },
  [FEATURES_ITEM_IDS.SOCIAL_CONNECT]: {
    variant: 'vanilla' as const,
    title: 'Connect Social',
    index: '007',
    caption: 'Pipe LinkedIn, Instagram, X, and more into your brand data.',
    visual: <SocialConnectVisual />,
  },
  [FEATURES_ITEM_IDS.WORKSPACE_CONNECT]: {
    variant: 'vanilla' as const,
    title: 'Connect Workspace',
    index: '008',
    caption: 'Bring Slack, Notion, Linear, and Drive into one workspace.',
    visual: <WorkspaceConnectVisual />,
  },
} as const;

export function FeaturesRow() {
  const order = useHomeLayoutStore((s) => s.itemOrders[HOME_SECTION_IDS.FEATURES] ?? []);
  const isEditing = useHomeLayoutStore((s) => s.isEditing);
  const reorder = useHomeLayoutStore((s) => s.reorderItems);

  const validOrder = order.filter(
    (id): id is keyof typeof FEATURE_BY_ID => id in FEATURE_BY_ID,
  );

  return (
    <section {...devProps('FeaturesRow')}>
      <SortableGroup
        ids={validOrder}
        strategy="horizontal"
        disabled={!isEditing}
        onReorder={(fromId, toId) => reorder(HOME_SECTION_IDS.FEATURES, fromId, toId)}
      >
        <FeatureCarousel count={validOrder.length}>
          {validOrder.map((id, i) => {
            const card = FEATURE_BY_ID[id];
            return (
              <div
                key={id}
                className="flex w-[calc((100%-20px)/3)] shrink-0"
              >
                <SortableItem
                  id={id}
                  index={i}
                  isEditing={isEditing}
                  handleLabel={`Drag to reorder ${card.title}`}
                  className="flex w-full"
                >
                  <FeatureCard {...card} />
                </SortableItem>
              </div>
            );
          })}
        </FeatureCarousel>
      </SortableGroup>
    </section>
  );
}
