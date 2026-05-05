'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Code01,
  FilterLines,
  LinkExternal01,
  Package,
  SearchLg,
  Tag01,
} from '@untitledui-pro/icons/line';
import { devProps } from '@/lib/utils/dev-props';

interface MarketplaceSkill {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
}

// Placeholder data representing what the real catalog will look like
const PLACEHOLDER_SKILLS: MarketplaceSkill[] = [
  {
    id: 'xlsx-generator',
    name: 'XLSX Generator',
    description: 'Generate and manipulate Excel spreadsheets with complex formulas, charts, and formatting directly from Claude.',
    category: 'Knowledge Work',
    tags: ['Spreadsheet', 'Data'],
    author: 'Anthropic',
  },
  {
    id: 'slides-creator',
    name: 'Slides Creator',
    description: 'Create professional presentations with layouts, themes, and content generation for Google Slides and PowerPoint.',
    category: 'Knowledge Work',
    tags: ['Slides', 'Creative'],
    author: 'Anthropic',
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Automated code review with best practices, security analysis, and performance suggestions.',
    category: 'Agent Skills',
    tags: ['Code', 'Analysis'],
    author: 'Anthropic',
  },
  {
    id: 'financial-analysis',
    name: 'Financial Analysis',
    description: 'Analyze financial statements, calculate ratios, and generate insights from financial data.',
    category: 'Financial Services',
    tags: ['Finance', 'Analysis'],
    author: 'Anthropic',
  },
  {
    id: 'docs-writer',
    name: 'Docs Writer',
    description: 'Generate well-structured documentation including API docs, README files, and technical guides.',
    category: 'Knowledge Work',
    tags: ['Docs', 'Creative'],
    author: 'Anthropic',
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Systematic research workflows with source tracking, summarization, and citation management.',
    category: 'Agent Skills',
    tags: ['Research', 'Analysis'],
    author: 'Anthropic',
  },
  {
    id: 'compliance-checker',
    name: 'Compliance Checker',
    description: 'Check documents and processes against regulatory frameworks and compliance requirements.',
    category: 'Financial Services',
    tags: ['Compliance', 'Finance'],
    author: 'Anthropic',
  },
  {
    id: 'design-system-gen',
    name: 'Design System Generator',
    description: 'Generate design tokens, component specs, and style guides from brand assets and guidelines.',
    category: 'Agent Skills',
    tags: ['Design', 'Creative'],
    author: 'Anthropic',
  },
];

const ALL_CATEGORIES = ['All', ...Array.from(new Set(PLACEHOLDER_SKILLS.map(s => s.category)))];

interface MarketplaceCatalogProps {
  onClose?: () => void;
}

export function MarketplaceCatalog({ onClose }: MarketplaceCatalogProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSkills = useMemo(() => {
    let results = PLACEHOLDER_SKILLS;

    if (activeCategory !== 'All') {
      results = results.filter(s => s.category === activeCategory);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      results = results.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    return results;
  }, [search, activeCategory]);

  return (
    <div {...devProps('MarketplaceCatalog')} className="p-6 space-y-5">
      {/* Search */}
      <div className="relative">
        <SearchLg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-tertiary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-secondary border border-border-primary text-fg-primary placeholder:text-fg-quaternary focus:border-border-brand focus:ring-1 focus:ring-brand focus:shadow-focus-ring outline-hidden transition-colors text-sm"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-bg-brand-primary text-fg-brand-primary border border-border-brand-solid'
                : 'bg-bg-secondary text-fg-tertiary border border-border-primary hover:border-border-brand'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="group p-4 rounded-xl bg-bg-secondary border border-border-primary hover:border-border-brand transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-fg-tertiary" />
                <h3 className="text-sm font-semibold text-fg-primary">
                  {skill.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-fg-tertiary mb-3 line-clamp-2">
              {skill.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {skill.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-bg-tertiary text-fg-quaternary"
                  >
                    <Tag01 className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>

              <button
                disabled
                title="Coming soon"
                className="px-3 py-1 rounded-lg text-xs font-medium bg-bg-tertiary text-fg-quaternary cursor-not-allowed"
              >
                Install
              </button>
            </div>

            <div className="mt-2 pt-2 border-t border-border-primary flex items-center justify-between text-[10px] text-fg-quaternary">
              <span>{skill.author}</span>
              <span className="flex items-center gap-1">
                {skill.category}
                <LinkExternal01 className="w-2.5 h-2.5" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="py-12 text-center">
          <Package className="w-8 h-8 text-fg-quaternary mx-auto mb-3" />
          <p className="text-sm text-fg-tertiary">No skills found matching your search.</p>
        </div>
      )}

      {/* Footer */}
      <div className="pt-2 text-center">
        <p className="text-xs text-fg-quaternary">
          Marketplace integration coming soon. Skills will be installable from Anthropic&apos;s community catalog.
        </p>
      </div>
    </div>
  );
}

export default MarketplaceCatalog;
