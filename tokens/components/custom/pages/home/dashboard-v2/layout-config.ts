/**
 * Stable ids and default orderings for the home dashboard layout.
 * Persisting ids (not indices) means adding or removing items later
 * won't corrupt saved user layouts — unknown ids are ignored, missing
 * ids are appended to the tail during hydration.
 */

export const HOME_SECTION_IDS = {
  TODAY: 'today-at-a-glance',
  FEATURES: 'features',
  BRAND_HEALTH: 'brand-health',
  SOCIAL_PULSE: 'social-pulse',
  WORKSPACE_PULSE: 'workspace-pulse',
} as const;

export type HomeSectionId = (typeof HOME_SECTION_IDS)[keyof typeof HOME_SECTION_IDS];

export const DEFAULT_SECTION_ORDER: HomeSectionId[] = [
  HOME_SECTION_IDS.TODAY,
  HOME_SECTION_IDS.FEATURES,
  HOME_SECTION_IDS.BRAND_HEALTH,
  HOME_SECTION_IDS.SOCIAL_PULSE,
  HOME_SECTION_IDS.WORKSPACE_PULSE,
];

export const TODAY_ITEM_IDS = {
  BRAND_HUB: 'kpi-brand-hub',
  BRAND_BRAIN: 'kpi-brand-brain',
  CONSISTENCY: 'kpi-consistency',
  ASSETS_LIVE: 'kpi-assets-live',
} as const;

export const FEATURES_ITEM_IDS = {
  PRODUCT_DEMO: 'feature-product-demo',
  BRAND_MCP: 'feature-brand-mcp',
  BRAND_VOICE: 'feature-brand-voice',
  STYLE_TOKENS: 'feature-style-tokens',
  WORKFLOWS: 'feature-workflows',
  SHARED_SPACES: 'feature-shared-spaces',
  SOCIAL_CONNECT: 'feature-social-connect',
  WORKSPACE_CONNECT: 'feature-workspace-connect',
} as const;

export const BRAND_HEALTH_ITEM_IDS = {
  SETUP_CHECKLIST: 'bh-setup-checklist',
  CONTEXT_RADAR: 'bh-context-radar',
} as const;

export const SOCIAL_PULSE_ITEM_IDS = {
  TOTAL_REACH: 'sp-total-reach',
  BY_CHANNEL: 'sp-by-channel',
  SENTIMENT: 'sp-sentiment',
  TOP_POST: 'sp-top-post',
} as const;

export const WORKSPACE_PULSE_ITEM_IDS = {
  ACTIVITY: 'wp-activity',
  NEXT_7_DAYS: 'wp-next-7-days',
  ASSET_USAGE: 'wp-asset-usage',
} as const;

export const DEFAULT_ITEM_ORDERS: Record<HomeSectionId, string[]> = {
  [HOME_SECTION_IDS.TODAY]: [
    TODAY_ITEM_IDS.BRAND_HUB,
    TODAY_ITEM_IDS.BRAND_BRAIN,
    TODAY_ITEM_IDS.CONSISTENCY,
    TODAY_ITEM_IDS.ASSETS_LIVE,
  ],
  [HOME_SECTION_IDS.FEATURES]: [
    FEATURES_ITEM_IDS.PRODUCT_DEMO,
    FEATURES_ITEM_IDS.BRAND_MCP,
    FEATURES_ITEM_IDS.BRAND_VOICE,
    FEATURES_ITEM_IDS.STYLE_TOKENS,
    FEATURES_ITEM_IDS.WORKFLOWS,
    FEATURES_ITEM_IDS.SHARED_SPACES,
    FEATURES_ITEM_IDS.SOCIAL_CONNECT,
    FEATURES_ITEM_IDS.WORKSPACE_CONNECT,
  ],
  [HOME_SECTION_IDS.BRAND_HEALTH]: [
    BRAND_HEALTH_ITEM_IDS.SETUP_CHECKLIST,
    BRAND_HEALTH_ITEM_IDS.CONTEXT_RADAR,
  ],
  [HOME_SECTION_IDS.SOCIAL_PULSE]: [
    SOCIAL_PULSE_ITEM_IDS.TOTAL_REACH,
    SOCIAL_PULSE_ITEM_IDS.BY_CHANNEL,
    SOCIAL_PULSE_ITEM_IDS.SENTIMENT,
    SOCIAL_PULSE_ITEM_IDS.TOP_POST,
  ],
  [HOME_SECTION_IDS.WORKSPACE_PULSE]: [
    WORKSPACE_PULSE_ITEM_IDS.ACTIVITY,
    WORKSPACE_PULSE_ITEM_IDS.NEXT_7_DAYS,
    WORKSPACE_PULSE_ITEM_IDS.ASSET_USAGE,
  ],
};

/**
 * Reconciles a saved order with the current default order.
 * Keeps known ids in their saved order, drops unknown ids, and appends
 * any defaults that are missing from the saved list.
 */
export function reconcileOrder(saved: string[] | undefined, defaults: string[]): string[] {
  if (!saved || saved.length === 0) return [...defaults];
  const defaultsSet = new Set(defaults);
  const kept = saved.filter((id) => defaultsSet.has(id));
  const seen = new Set(kept);
  const appended = defaults.filter((id) => !seen.has(id));
  return [...kept, ...appended];
}
