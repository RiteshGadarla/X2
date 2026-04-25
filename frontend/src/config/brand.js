export const BRAND_COLORS = {
  primary: 'var(--primary)',
  pink: 'var(--pink)',
  cyan: 'var(--cyan)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  error: 'var(--error)',
  neutral1: 'var(--neutral-1)',
  neutral2: 'var(--neutral-2)',
  neutral3: 'var(--neutral-3)',
  neutral4: 'var(--neutral-4)',
  neutral6: 'var(--neutral-6)',
  neutral7: 'var(--neutral-7)',
  neutral8: 'var(--neutral-8)',
  neutral9: 'var(--neutral-9)'
};

export const CHART_THEME = {
  axisTick: { fontSize: 10, fill: BRAND_COLORS.neutral4 },
  tooltip: {
    borderRadius: '8px',
    border: `1px solid ${BRAND_COLORS.neutral7}`,
    fontSize: '11px',
    backgroundColor: BRAND_COLORS.neutral9
  }
};

export const BRAND_PALETTES = {
  roleStatus: [BRAND_COLORS.success, BRAND_COLORS.primary, BRAND_COLORS.warning],
  checkpoint: [BRAND_COLORS.primary, BRAND_COLORS.warning, BRAND_COLORS.error],
  channels: [BRAND_COLORS.primary, BRAND_COLORS.pink, BRAND_COLORS.cyan, BRAND_COLORS.success, BRAND_COLORS.warning],
  priorityByTicket: {
    P1: BRAND_COLORS.error,
    P2: BRAND_COLORS.warning,
    P3: BRAND_COLORS.primary,
    P4: BRAND_COLORS.cyan
  },
  legalBreakdown: [BRAND_COLORS.error, BRAND_COLORS.warning, BRAND_COLORS.primary]
};

export const ROLE_PILLARS = {
  SUPPORT_LEAD: ['Live Intake', 'SLA Focus', 'KB Drafting'],
  SUPPORT_MANAGER: ['Sentiment Feed', 'HIL Review', 'VoC Insights'],
  VP_CUSTOMER_SUCCESS: ['Executive View', 'VoC Panel', 'Escalation Overrides'],
  LEGAL_COMPLIANCE: ['Legal HIL Queue', 'Compliance Flags', 'Correspondence Governance'],
  ADMIN_OPS: ['Channel Volume', 'Integration Monitoring', 'Operational Availability'],
  CUSTOMER: ['Customer Portal', 'AI Disclosure + Human Escalation', 'Linked KB Guidance']
};