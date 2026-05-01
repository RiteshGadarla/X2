/**
 * Guided tour / automation step definitions for aegis.ai.
 *
 * Every interactive element in the codebase has a stable snake_case id.
 * Selectors in this file use the "#id" format so an AI agent can call:
 *   page.click(step.selector)           // Playwright
 *   document.querySelector(step.selector).click()   // DOM
 *   document.getElementById(step.elementId).click() // direct lookup
 *
 * Field reference
 * ───────────────
 * id          – kebab-case step identifier (unique across all tours)
 * feature     – which UI area this element belongs to (for agent context)
 * description – one-line human-readable intent
 * action      – click | type | highlight | navigate | wait
 * selector    – "#dom_id" — primary selector for page.click / querySelector
 * elementId   – raw DOM id (no #) for document.getElementById
 * tourSelector– alternative `[data-tour="…"]` selector for cases where a
 *               selector wants extra disambiguation
 * value       – required only for "type" action
 * speak       – narration: before | during | after  (shorthand: "speak": "text" → before)
 * pause       – { beforeMs, afterMs }  wait times around the step
 * waitMs      – explicit wait step (action: "wait")
 * highlight   – true | false | { durationMs } (max 10000 ms)
 *
 * Frontend layout notes (kept current with code)
 * ──────────────────────────────────────────────
 * • There is NO login screen in the live app. App.jsx mounts <Desktop/>
 *   directly inside <AuthProvider/>; role starts as `null`. RoleSelector.jsx
 *   exists in the repo but is never rendered (dead code, kept for reference).
 *   IDs prefixed with `global_` / `dock_word/powerpoint/excel_btn` are
 *   therefore listed under `legacyLogin` only as a registry — selectors
 *   referring to them will not match anything until RoleSelector is mounted.
 * • Initial UI is Desktop.jsx — a virtual "OS" with:
 *     – Top-left: Aegis AI branding (logo + "Customer Support Management").
 *     – Top-right: dual-zone clock (GMT + IST).
 *     – Bottom dock: decorative Office tiles (PPT/Word/Excel/Outlook/Teams,
 *       no ids), then Reporting Center, Notes, and the purple aegis.ai shield.
 * • Clicking the aegis.ai dock icon (dock_aegis_btn) is the entry point:
 *     – Opens the aegis app window MAXIMIZED, and
 *     – Calls setRole('SUPPORT_LEAD'), which mounts MainLayout + the Support
 *       Lead dashboard at /support-lead. Support Lead is therefore the
 *       initial workspace for every first-run user.
 *     – Closing the aegis window calls setRole(null) and returns the user
 *       to the bare desktop.
 * • Reporting Center and Notes open as standalone desktop windows alongside
 *   the aegis app. They do not require a role.
 * • Inside the aegis app, the sidebar role-switcher button at the bottom
 *   opens an upward fly-out listing all six roles; selecting one navigates
 *   to that role's home (no logout/login round-trip).
 */

// ─── ELEMENT ID REGISTRY ────────────────────────────────────────────────────
// Single source of truth: feature → button id → DOM id.
// An agent can import this object to look up any element without parsing HTML.

export const ELEMENT_IDS = {
  // ── Desktop Shell — INITIAL UI ────────────────────────────────────────────
  // App.jsx mounts <Desktop/> directly. role starts null and the user sees
  // wallpaper + clock + bottom dock. Clicking dockAegisBtn opens the aegis
  // app window maximized and calls setRole('SUPPORT_LEAD') — that single
  // click is the application's entry point.
  desktop: {
    dockAegisBtn:           'dock_aegis_btn',            // aegis.ai icon in bottom dock (entry point — sets role=SUPPORT_LEAD)
    dockReportingCenterBtn: 'dock_reporting_center_btn', // Reporting Center icon in bottom dock
    dockNotesBtn:           'dock_notes_btn',            // Notes icon in bottom dock
  },

  // ── Legacy login (RoleSelector.jsx — currently NOT mounted) ───────────────
  // RoleSelector.jsx defines a separate Ubuntu-style login screen with a
  // vertical left dock + role dropdown + Log In button. App.jsx does not
  // render it, so these ids will not be present in the live DOM. Kept here
  // strictly as a registry in case RoleSelector is re-enabled. DO NOT use
  // these in active tour flows.
  legacyLogin: {
    roleSelect:        'global_select_role_dropdown',
    submitBtn:         'global_login_btn',
    dockWordBtn:       'dock_word_btn',
    dockPowerpointBtn: 'dock_powerpoint_btn',
    dockExcelBtn:      'dock_excel_btn',
    dockAegisBtn:      'dock_aegis_btn',
  },

  // ── App Windows ───────────────────────────────────────────────────────────
  aegisWindow: {
    minimizeBtn: 'aegis_window_minimize_btn',
    maximizeBtn: 'aegis_window_maximize_btn',
    closeBtn:    'aegis_window_close_btn',               // closing also clears the role and returns to login
  },
  reportingCenterWindow: {
    minimizeBtn: 'reporting_center_window_minimize_btn',
    maximizeBtn: 'reporting_center_window_maximize_btn',
    closeBtn:    'reporting_center_window_close_btn',
    clearBtn:    'reports_clear_btn',
  },
  notesWindow: {
    minimizeBtn:  'notes_window_minimize_btn',
    maximizeBtn:  'notes_window_maximize_btn',
    closeBtn:     'notes_window_close_btn',
    newTextarea:  'notes_new_textarea',                  // write new note here
    saveNewBtn:   'notes_save_new_btn',                  // save new note
    // Per-note (replace {id} with actual note id at runtime):
    // editBtn:    `note_edit_{id}_btn`
    // deleteBtn:  `note_delete_{id}_btn`
    // editTextarea: `note_edit_textarea_{id}`
    // cancelBtn:  `note_edit_cancel_{id}_btn`
    // saveEditBtn:`note_edit_save_{id}_btn`
  },

  // ── Sidebar Navigation ────────────────────────────────────────────────────
  // Nav items are filtered by role (see ROLE_NAV in Sidebar.jsx). A button
  // listed here may not be present in the DOM unless the active role grants
  // it. To switch roles use the role switcher → sidebar_role_option_{role}_btn.
  sidebar: {
    roleSwitcherBtn: 'sidebar_role_switcher_btn',        // opens role panel (upward fly-out)

    // Role option buttons (replace {role} with lowercase role id, e.g. 'support_lead'):
    // roleOptionBtn: `sidebar_role_option_{role}_btn`
    roleOptionSupportLeadBtn:        'sidebar_role_option_support_lead_btn',
    roleOptionSupportManagerBtn:     'sidebar_role_option_support_manager_btn',
    roleOptionVpCustomerSuccessBtn:  'sidebar_role_option_vp_customer_success_btn',
    roleOptionLegalComplianceBtn:    'sidebar_role_option_legal_compliance_btn',
    roleOptionAdminOpsBtn:           'sidebar_role_option_admin_ops_btn',
    roleOptionCustomerBtn:           'sidebar_role_option_customer_btn',

    // Nav items (id = `nav_${label.toLowerCase().replace(/\s+/g, '_')}_btn`):
    navHomeBtn:           'nav_home_btn',
    navTicketsBtn:        'nav_tickets_btn',
    navSlaBtn:            'nav_sla_btn',
    navReviewBtn:         'nav_review_btn',
    navKnowledgeBaseBtn:  'nav_knowledge_base_btn',
    navSentimentBtn:      'nav_sentiment_btn',
    navVoCBtn:            'nav_voc_btn',
    navExecutiveBtn:      'nav_executive_btn',
    navReviewOverrideBtn: 'nav_review_override_btn',
    navLegalQueueBtn:     'nav_legal_queue_btn',
    navIntegrationsBtn:   'nav_integrations_btn',
    navChannelsBtn:       'nav_channels_btn',
    navDashboardBtn:      'nav_dashboard_btn',
    navMyPortalBtn:       'nav_my_portal_btn',
  },

  // ── Customer Portal ───────────────────────────────────────────────────────
  customerPortal: {
    aiAcknowledgeCheckbox:    'portal_ai_acknowledge_checkbox',
    titleInput:               'ticket_title_input',
    productAreaSelect:        'ticket_product_area_select',
    issueTypeSelect:          'ticket_issue_type_select',
    descriptionTextarea:      'ticket_description_textarea',
    businessImpactTextarea:   'ticket_business_impact_textarea',
    submitBtn:                'ticket_submit_btn',
    attachEvidenceBtn:        'ticket_attach_evidence_btn',
  },

  // ── Dashboard (action + report buttons) ──────────────────────────────────
  dashboard: {
    // Action buttons (id = `action_${permission.toLowerCase()}_btn`):
    actionViewTicketsBtn:        'action_view_tickets_btn',
    actionViewSlaBtn:            'action_view_sla_btn',
    actionViewSentimentBtn:      'action_view_sentiment_btn',
    actionViewHilStatusBtn:      'action_view_hil_status_btn',
    actionApproveHilBtn:         'action_approve_hil_btn',
    actionApproveHilOverrideBtn: 'action_approve_hil_override_btn',
    actionDraftKbBtn:            'action_draft_kb_btn',
    actionPublishKbBtn:          'action_publish_kb_btn',
    actionViewKbBtn:             'action_view_kb_btn',
    actionViewVocBtn:            'action_view_voc_btn',
    actionViewExecDashBtn:       'action_view_exec_dash_btn',
    actionViewLegalTicketsBtn:   'action_view_legal_tickets_btn',
    actionManageLegalBtn:        'action_manage_legal_correspondence_btn',
    actionManageIntegrationsBtn: 'action_manage_integrations_btn',
    actionViewCustomerPortalBtn: 'action_view_customer_portal_btn',

    // Report run buttons (id = `report_run_${report_id.replace(/-/g, '_')}_btn`):
    reportRunDailySupportDigestBtn:   'report_run_daily_support_digest_btn',
    reportRunWeeklySlaComplianceBtn:  'report_run_weekly_sla_compliance_btn',
    reportRunCsatSatisfactionBtn:     'report_run_csat_satisfaction_btn',
    reportRunTicketAgeingBtn:         'report_run_ticket_ageing_escalation_btn',
    reportRunMonthlyVocKbBtn:         'report_run_monthly_voc_kb_btn',
  },

  // ── Live Ticket Queue ─────────────────────────────────────────────────────
  liveTicketQueue: {
    // Per-ticket review buttons (replace {id} with ticket id):
    // reviewBtn: `tickets_view_{id}_btn`
    // data-testid: `ticket-review-{id}-btn`
  },

  // ── HIL Review Queue ──────────────────────────────────────────────────────
  hilReviewQueue: {
    bulkApproveBtn: 'review_approve_all_btn',
    // Per-ticket (replace {id} with review_id or ticket_id):
    // approveBtn: `review_approve_{id}_btn`
    // modifyBtn:  `review_modify_{id}_btn`
    // rejectBtn:  `review_reject_{id}_btn`
  },

  // ── Knowledge Base ────────────────────────────────────────────────────────
  kbPanel: {
    reviewDraftsBtn:  'kb_review_drafts_btn',
    createArticleBtn: 'kb_create_new_btn',
  },

  // ── SLA Compliance ────────────────────────────────────────────────────────
  slaCompliance: {
    exportReportBtn: 'sla_export_report_btn',
  },

  // ── Sentiment Feed ────────────────────────────────────────────────────────
  sentimentFeed: {
    // Per-ticket (replace {id} with ticket id):
    // interveneBtn: `sentiment_escalate_{id}_btn`
  },

  // ── Executive Dashboard ───────────────────────────────────────────────────
  executiveDashboard: {
    exportRollupBtn: 'exec_export_rollup_btn',
  },

  // ── Voice of Customer ─────────────────────────────────────────────────────
  vocPanel: {
    exportReportBtn: 'voc_export_report_btn',
  },

  // ── Legal Compliance ──────────────────────────────────────────────────────
  legalCompliance: {
    approveResponseBtn:       'legal_approve_response_btn',
    requestPolicyRevisionBtn: 'legal_request_policy_revision_btn',
  },

  // ── Integration Panel ─────────────────────────────────────────────────────
  integrationPanel: {
    forceSyncBtn: 'settings_refresh_sync_btn',
  },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
/** Return the CSS selector string for a given DOM id. */
export const sel = (domId) => `#${domId}`;

/** Return the [data-tour="…"] CSS selector — useful for steps that prefer
 *  a stable tour-specific hook over the raw DOM id. */
export const tourSel = (tourId) => `[data-tour="${tourId}"]`;

// ─── ONBOARDING TOUR ────────────────────────────────────────────────────────
// The first-run narrative. There is NO login screen — the user lands on the
// desktop immediately. This tour:
//   1. Introduces the project (what aegis.ai is, what it does).
//   2. Orients the user on the desktop shell (clock, branding, bottom dock).
//   3. Opens the aegis.ai app from the dock — the single click that also
//      activates the SUPPORT_LEAD role and routes to the Support Lead
//      dashboard, which is the platform's default initial workspace.
//   4. Walks the Support Lead dashboard at a high level so the user knows
//      what they are looking at before diving into the deep tour.

export const onboardingTour = [
  // ── 1. Project introduction (narration only) ────────────────────────────
  {
    id: 'intro-welcome',
    feature: 'Desktop Shell',
    description: 'Welcome the user and introduce aegis.ai at a high level',
    action: 'highlight',
    selector: '.desktop-shell',
    highlight: { durationMs: 2500 },
    speak: {
      before:
        'Welcome to aegis dot a-i — an AI-assisted Customer Support Management platform. ' +
        'aegis brings the live ticket queue, SLA compliance, escalation review, the knowledge base, ' +
        'voice of customer, legal triage, and the executive rollup into a single workspace, ' +
        'with role-aware views for support leads, managers, VPs, legal, admin ops, and customers. ' +
        'There is no login step — you start right here on the desktop. ' +
        'I will walk you through the desktop, open the application, and then show the Support Lead dashboard ' +
        'that aegis lands on by default.',
    },
    pause: { afterMs: 1200 },
  },

  // ── 2. Tour the desktop shell ───────────────────────────────────────────
  {
    id: 'desktop-branding',
    feature: 'Desktop Shell',
    description: 'Point out the Aegis AI branding in the top-left corner',
    action: 'highlight',
    selector: '.desktop-shell',
    highlight: { durationMs: 2500 },
    speak: {
      before:
        'In the top-left you have the Aegis AI logo and tagline — Customer Support Management. ' +
        'On the right, a dual-zone clock shows GMT and IST so distributed teams stay aligned.',
    },
    pause: { afterMs: 500 },
  },
  {
    id: 'desktop-dock-orient',
    feature: 'Desktop / Bottom Dock',
    description: 'Orient the user on the bottom dock and its three actionable icons',
    action: 'highlight',
    selector: '.bottom-dock',
    highlight: { durationMs: 3000 },
    speak: {
      before:
        'The bottom dock holds five decorative Office tiles — PowerPoint, Word, Excel, Outlook, and Teams — ' +
        'and three working apps: the Reporting Center where every export lands, ' +
        'a Notes scratchpad that persists between sessions, ' +
        'and the purple aegis.ai shield that launches the main application. ' +
        'The shield is what we want.',
    },
    pause: { afterMs: 500 },
  },

  // ── 3. Single-click entry into the app ──────────────────────────────────
  {
    id: 'open-aegis-app',
    feature: 'Desktop / Bottom Dock',
    description: 'Open the aegis.ai application from the desktop bottom dock',
    action: 'click',
    selector: `#${ELEMENT_IDS.desktop.dockAegisBtn}`,
    elementId: ELEMENT_IDS.desktop.dockAegisBtn,
    tourSelector: '[data-tour="dock-aegis"]',
    speak: {
      before:
        'Click the purple aegis.ai shield to launch the application. ' +
        'A single click opens the window maximized AND activates the Support Lead role ' +
        'in one step — there is no separate login.',
      during: 'Opening aegis.ai…',
      after:
        'The aegis.ai window is open. You are now in the Support Lead workspace, ' +
        'which is the default initial view of the platform.',
    },
    pause: { afterMs: 1200 },
  },

  // ── 4. Tour the Support Lead dashboard (the initial view) ───────────────
  {
    id: 'sl-intro-dashboard',
    feature: 'Dashboard (Support Lead)',
    description: 'Introduce the Support Lead dashboard as the initial workspace',
    action: 'highlight',
    selector: '.route-page',
    highlight: { durationMs: 3000 },
    speak: {
      before:
        'This is the Support Lead dashboard — your home base. ' +
        'It surfaces the actions you are permitted to take and the reports you can run. ' +
        'A Support Lead owns the live ticket queue, SLA compliance, escalation review, and the knowledge base — ' +
        'the four pillars of day-to-day frontline support operations.',
    },
    pause: { afterMs: 500 },
  },
  {
    id: 'sl-intro-sidebar',
    feature: 'Sidebar Navigation',
    description: 'Highlight the Support Lead sidebar nav as the primary navigation',
    action: 'highlight',
    selector: '.app-sidebar',
    highlight: { durationMs: 3000 },
    speak: {
      before:
        'On the left is the role-aware sidebar. For Support Lead it shows five items: ' +
        'Home, Tickets, SLA, Review, and Knowledge Base. ' +
        'The avatar at the very bottom — labelled "SL" — opens a panel for switching to any other role ' +
        'without leaving the application.',
    },
    pause: { afterMs: 500 },
  },
  {
    id: 'sl-intro-actions',
    feature: 'Dashboard (Support Lead)',
    description: 'Point to the action buttons surfaced on the dashboard',
    action: 'highlight',
    selector: `#${ELEMENT_IDS.dashboard.actionViewTicketsBtn}`,
    elementId: ELEMENT_IDS.dashboard.actionViewTicketsBtn,
    highlight: { durationMs: 3000 },
    speak: {
      before:
        'Each action button on the dashboard is a shortcut into a Support Lead capability — ' +
        'view tickets, view SLA, approve human-in-the-loop escalations, draft and publish KB articles. ' +
        'You are all set. The Support Lead deep-dive tour is the natural next step from here.',
    },
    pause: { afterMs: 600 },
  },
];

// ─── SUPPORT LEAD TOUR ──────────────────────────────────────────────────────
// Assumes the aegis app is already open and the active role is SUPPORT_LEAD
// (which is the default after open-aegis-app from the onboarding tour).
// If the user lands on this tour from a different role, an agent should
// pre-pend a role-switch step (see switchToSupportLead helper below).

export const supportLeadTour = [
  {
    id: 'sl-ensure-role',
    feature: 'Sidebar Navigation',
    description: 'Ensure the Support Lead role is active before tour begins',
    action: 'highlight',
    selector: `#${ELEMENT_IDS.sidebar.roleSwitcherBtn}`,
    elementId: ELEMENT_IDS.sidebar.roleSwitcherBtn,
    tourSelector: '[data-tour="role-switcher"]',
    highlight: { durationMs: 1500 },
    speak: {
      before: 'The role avatar at the bottom of the sidebar shows your active role. The Support Lead initials "SL" should be visible — if not, click here to switch.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'sl-nav-home',
    feature: 'Sidebar Navigation',
    description: 'Open the Support Lead home dashboard',
    action: 'click',
    selector: `#${ELEMENT_IDS.sidebar.navHomeBtn}`,
    elementId: ELEMENT_IDS.sidebar.navHomeBtn,
    tourSelector: '[data-tour="nav-home"]',
    speak: {
      before: 'Start at Home — your dashboard summarises permitted actions and the reports you can run.',
      after: 'Dashboard loaded. Action buttons reflect the permissions granted to Support Lead.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'sl-nav-tickets',
    feature: 'Sidebar Navigation',
    description: 'Navigate to the live ticket queue',
    action: 'click',
    selector: `#${ELEMENT_IDS.sidebar.navTicketsBtn}`,
    elementId: ELEMENT_IDS.sidebar.navTicketsBtn,
    tourSelector: '[data-tour="nav-tickets"]',
    speak: {
      before: 'Open Tickets to see the live queue, sorted by SLA priority, ticket priority, and customer tier.',
      after: 'You are viewing the live ticket queue. Each row has a Review button.',
    },
    pause: { afterMs: 500 },
  },
  {
    id: 'sl-ticket-review-first',
    feature: 'Live Ticket Queue',
    description: 'Highlight the first ticket review button in the table',
    action: 'highlight',
    selector: '[data-testid^="ticket-review-"]',
    highlight: { durationMs: 2500 },
    speak: {
      before: 'Each row has a Review button. Its id follows the pattern tickets_view_{ticket_id}_btn — an agent can click any row by substituting the ticket id.',
    },
    pause: { afterMs: 500 },
  },
  {
    id: 'sl-nav-sla',
    feature: 'Sidebar Navigation',
    description: 'Navigate to the SLA compliance dashboard',
    action: 'click',
    selector: `#${ELEMENT_IDS.sidebar.navSlaBtn}`,
    elementId: ELEMENT_IDS.sidebar.navSlaBtn,
    tourSelector: '[data-tour="nav-sla"]',
    speak: {
      before: 'Check SLA compliance. Click the SLA nav item.',
      after: 'This dashboard shows per-priority compliance rates against your SLA targets.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'sl-sla-export-report',
    feature: 'SLA Compliance Dashboard',
    description: 'Export the SLA compliance report as CSV',
    action: 'click',
    selector: `#${ELEMENT_IDS.slaCompliance.exportReportBtn}`,
    elementId: ELEMENT_IDS.slaCompliance.exportReportBtn,
    tourSelector: '[data-tour="sla-export-report"]',
    speak: {
      before: 'Use Export SLA Report to send a CSV snapshot. The result lands in the Reporting Center on the desktop.',
      after: 'Report export triggered. Open the Reporting Center from the bottom dock to retrieve the file.',
    },
    pause: { afterMs: 300 },
  },
  {
    id: 'sl-nav-review',
    feature: 'Sidebar Navigation',
    description: 'Navigate to the HIL escalation review queue',
    action: 'click',
    selector: `#${ELEMENT_IDS.sidebar.navReviewBtn}`,
    elementId: ELEMENT_IDS.sidebar.navReviewBtn,
    tourSelector: '[data-tour="nav-review"]',
    speak: {
      before: 'Open the Review queue for escalated tickets requiring human approval.',
      after: 'The escalation queue shows billing, legal, and VIP checkpoints awaiting decision.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'sl-review-bulk-approve',
    feature: 'HIL Review Queue',
    description: 'Bulk approve all standard escalations in the review queue',
    action: 'click',
    selector: `#${ELEMENT_IDS.hilReviewQueue.bulkApproveBtn}`,
    elementId: ELEMENT_IDS.hilReviewQueue.bulkApproveBtn,
    tourSelector: '[data-tour="review-bulk-approve"]',
    speak: {
      before: 'Bulk-approve standard escalations with a single click. Per-row buttons (review_approve_{id}_btn / review_modify_{id}_btn / review_reject_{id}_btn) handle individual decisions.',
      after: 'Bulk approval executed. Decisions are logged to the ITSM system.',
    },
    pause: { afterMs: 300 },
  },
  {
    id: 'sl-nav-knowledge-base',
    feature: 'Sidebar Navigation',
    description: 'Navigate to the Knowledge Base panel',
    action: 'click',
    selector: `#${ELEMENT_IDS.sidebar.navKnowledgeBaseBtn}`,
    elementId: ELEMENT_IDS.sidebar.navKnowledgeBaseBtn,
    tourSelector: '[data-tour="nav-knowledge-base"]',
    speak: {
      before: 'Check the Knowledge Base to review draft articles before publishing.',
      after: 'KB panel loaded — usage rate, success rate, and pending drafts are visible.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'sl-kb-review-drafts',
    feature: 'Knowledge Base Panel',
    description: 'Open the KB draft review queue',
    action: 'click',
    selector: `#${ELEMENT_IDS.kbPanel.reviewDraftsBtn}`,
    elementId: ELEMENT_IDS.kbPanel.reviewDraftsBtn,
    tourSelector: '[data-tour="kb-review-drafts"]',
    speak: {
      before: 'Click Review Drafts to open articles awaiting quality approval.',
      after: 'Draft review queue opened. Articles are filtered to pending HIL status.',
    },
    pause: { afterMs: 300 },
  },
];

// ─── ROLE SWITCH HELPERS ────────────────────────────────────────────────────
// Building block for tours that need to start in a specific role. An agent
// that starts in Support Lead and wants to demonstrate, say, Legal Compliance
// should pre-pend `switchToRole('legal_compliance')` to the legal tour.

export const switchToRole = (roleId) => {
  const lower = roleId.toLowerCase();
  const optionId = `sidebar_role_option_${lower}_btn`;
  const label = lower.replace(/_/g, ' ');
  return [
    {
      id: `switch-open-role-panel-${lower}`,
      feature: 'Sidebar Navigation',
      description: 'Open the role switcher panel from the bottom of the sidebar',
      action: 'click',
      selector: `#${ELEMENT_IDS.sidebar.roleSwitcherBtn}`,
      elementId: ELEMENT_IDS.sidebar.roleSwitcherBtn,
      tourSelector: '[data-tour="role-switcher"]',
      speak: {
        before: 'Open the role switcher to change workspace.',
      },
      pause: { afterMs: 400 },
    },
    {
      id: `switch-pick-role-${lower}`,
      feature: 'Sidebar Navigation',
      description: `Select the ${label} role from the role panel`,
      action: 'click',
      selector: `#${optionId}`,
      elementId: optionId,
      speak: {
        during: `Switching to ${label}.`,
        after: `Role switched. You are now in the ${label} workspace.`,
      },
      pause: { afterMs: 600 },
    },
  ];
};

// ─── CUSTOMER PORTAL TOUR ───────────────────────────────────────────────────
// To reach the Customer Portal: open the aegis app from the desktop dock
// (lands as Support Lead by default), use the sidebar role switcher to pick
// the Customer role — the sidebar then shows "Dashboard" and "My Portal" —
// and click "My Portal". This tour assumes you are already on that page.

export const customerPortalTour = [
  {
    id: 'portal-acknowledge',
    feature: 'Customer Portal',
    description: 'Check the AI assistant acknowledgment checkbox to unlock the form',
    action: 'click',
    selector: `#${ELEMENT_IDS.customerPortal.aiAcknowledgeCheckbox}`,
    elementId: ELEMENT_IDS.customerPortal.aiAcknowledgeCheckbox,
    speak: {
      before: 'Acknowledge the AI assistant disclaimer to unlock the submission form.',
      after: 'Acknowledged. The form fields are now active.',
    },
    pause: { afterMs: 300 },
  },
  {
    id: 'ticket-title-input',
    feature: 'Customer Portal',
    description: 'Type the issue title into the ticket form title field',
    action: 'type',
    selector: `#${ELEMENT_IDS.customerPortal.titleInput}`,
    elementId: ELEMENT_IDS.customerPortal.titleInput,
    tourSelector: '[data-tour="ticket-title-input"]',
    value: 'Payment gateway returning 502 on checkout',
    speak: {
      before: 'Enter a concise title describing the issue.',
      after: 'Title entered.',
    },
    pause: { afterMs: 200 },
  },
  {
    id: 'ticket-product-area',
    feature: 'Customer Portal',
    description: 'Select the affected product area from the dropdown',
    action: 'click',
    selector: `#${ELEMENT_IDS.customerPortal.productAreaSelect}`,
    elementId: ELEMENT_IDS.customerPortal.productAreaSelect,
    speak: {
      before: 'Choose the product area affected by this issue.',
      after: 'Product area selected.',
    },
    pause: { afterMs: 200 },
  },
  {
    id: 'ticket-issue-type',
    feature: 'Customer Portal',
    description: 'Select the issue type from the dropdown',
    action: 'click',
    selector: `#${ELEMENT_IDS.customerPortal.issueTypeSelect}`,
    elementId: ELEMENT_IDS.customerPortal.issueTypeSelect,
    speak: {
      before: 'Select the issue category that best matches your problem.',
      after: 'Issue type selected.',
    },
    pause: { afterMs: 200 },
  },
  {
    id: 'ticket-description',
    feature: 'Customer Portal',
    description: 'Fill in the issue description textarea',
    action: 'type',
    selector: `#${ELEMENT_IDS.customerPortal.descriptionTextarea}`,
    elementId: ELEMENT_IDS.customerPortal.descriptionTextarea,
    value: 'Checkout flow fails at payment step with a 502 Bad Gateway error. Affects all users on the Payments product area.',
    speak: {
      before: 'Describe the issue — include error messages and expected behavior.',
      after: 'Description filled.',
    },
    pause: { afterMs: 200 },
  },
  {
    id: 'ticket-business-impact',
    feature: 'Customer Portal',
    description: 'Fill in the business impact textarea',
    action: 'type',
    selector: `#${ELEMENT_IDS.customerPortal.businessImpactTextarea}`,
    elementId: ELEMENT_IDS.customerPortal.businessImpactTextarea,
    value: 'Blocking all payment transactions. Estimated revenue impact: $50K/hour.',
    speak: {
      before: 'State the user or revenue impact to set ticket priority correctly.',
      after: 'Business impact captured.',
    },
    pause: { afterMs: 200 },
  },
  {
    id: 'ticket-submit',
    feature: 'Customer Portal',
    description: 'Click Submit Ticket to send the new ticket to the support team',
    action: 'click',
    selector: `#${ELEMENT_IDS.customerPortal.submitBtn}`,
    elementId: ELEMENT_IDS.customerPortal.submitBtn,
    tourSelector: '[data-tour="ticket-submit"]',
    speak: {
      before: 'Click Submit Ticket to send your request to the support team.',
      during: 'Submitting ticket…',
      after: 'Ticket submitted successfully.',
    },
    pause: { afterMs: 500 },
  },
];

// ─── LEGAL COMPLIANCE TOUR ──────────────────────────────────────────────────

export const legalComplianceTour = [
  {
    id: 'nav-legal-queue',
    feature: 'Sidebar Navigation',
    description: 'Navigate to the Legal Queue',
    action: 'click',
    selector: `#${ELEMENT_IDS.sidebar.navLegalQueueBtn}`,
    elementId: ELEMENT_IDS.sidebar.navLegalQueueBtn,
    tourSelector: '[data-tour="nav-legal-queue"]',
    speak: {
      before: 'Open the Legal Queue to review compliance-flagged tickets.',
      after: 'Legal and Compliance Command Board loaded.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'legal-approve-response',
    feature: 'Legal Compliance Dashboard',
    description: 'Approve a reviewed legal response for customer delivery',
    action: 'click',
    selector: `#${ELEMENT_IDS.legalCompliance.approveResponseBtn}`,
    elementId: ELEMENT_IDS.legalCompliance.approveResponseBtn,
    tourSelector: '[data-tour="legal-approve-response"]',
    speak: {
      before: 'Click Approve Legal Response to clear a reviewed customer communication.',
      after: 'Approval recorded. The communication can now be sent to the customer.',
    },
    pause: { afterMs: 300 },
  },
  {
    id: 'legal-request-revision',
    feature: 'Legal Compliance Dashboard',
    description: 'Request a policy revision from the compliance team',
    action: 'click',
    selector: `#${ELEMENT_IDS.legalCompliance.requestPolicyRevisionBtn}`,
    elementId: ELEMENT_IDS.legalCompliance.requestPolicyRevisionBtn,
    speak: {
      before: 'Click Request Policy Revision to route a compliance update to policy owners.',
      after: 'Revision request sent to policy owners.',
    },
    pause: { afterMs: 300 },
  },
];

// ─── EXECUTIVE / VP TOUR ────────────────────────────────────────────────────

export const executiveDashboardTour = [
  {
    id: 'nav-executive',
    feature: 'Sidebar Navigation',
    description: 'Navigate to the Executive dashboard',
    action: 'click',
    selector: `#${ELEMENT_IDS.sidebar.navExecutiveBtn}`,
    elementId: ELEMENT_IDS.sidebar.navExecutiveBtn,
    tourSelector: '[data-tour="nav-executive"]',
    speak: {
      before: 'Open the Executive dashboard for a high-level view of operational health.',
      after: 'Executive Summary loaded — revenue protected, P1 outages, and CSAT at a glance.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'exec-export-rollup',
    feature: 'Executive Dashboard',
    description: 'Download the daily R-01 executive rollup report',
    action: 'click',
    selector: `#${ELEMENT_IDS.executiveDashboard.exportRollupBtn}`,
    elementId: ELEMENT_IDS.executiveDashboard.exportRollupBtn,
    tourSelector: '[data-tour="exec-export-rollup"]',
    speak: {
      before: 'Download the R-01 Daily Rollup to share with stakeholders.',
      after: 'R-01 digest generated with SLA and CSAT summary.',
    },
    pause: { afterMs: 300 },
  },
  {
    id: 'nav-voc',
    feature: 'Sidebar Navigation',
    description: 'Navigate to the Voice of Customer panel',
    action: 'click',
    selector: `#${ELEMENT_IDS.sidebar.navVoCBtn}`,
    elementId: ELEMENT_IDS.sidebar.navVoCBtn,
    tourSelector: '[data-tour="nav-voc"]',
    speak: {
      before: 'Review Voice of Customer trends to understand feature demand and CSAT momentum.',
      after: 'VoC panel shows 5-week CSAT trend and top feature requests.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'voc-export-report',
    feature: 'Voice of Customer Panel',
    description: 'Export the monthly VoC report for Product and CX leadership',
    action: 'click',
    selector: `#${ELEMENT_IDS.vocPanel.exportReportBtn}`,
    elementId: ELEMENT_IDS.vocPanel.exportReportBtn,
    tourSelector: '[data-tour="voc-export-report"]',
    speak: {
      before: 'Export the monthly VoC packet for the Product and CX leadership teams.',
      after: 'VoC report exported.',
    },
    pause: { afterMs: 300 },
  },
];

// ─── ADMIN OPS TOUR ─────────────────────────────────────────────────────────

export const adminOpsTour = [
  {
    id: 'nav-integrations',
    feature: 'Sidebar Navigation',
    description: 'Navigate to the integrations panel',
    action: 'click',
    selector: `#${ELEMENT_IDS.sidebar.navIntegrationsBtn}`,
    elementId: ELEMENT_IDS.sidebar.navIntegrationsBtn,
    tourSelector: '[data-tour="nav-integrations"]',
    speak: {
      before: 'Open Integrations to view channel volume and sync health.',
      after: 'Channel Volume and Integration Panel loaded.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'integrations-force-sync',
    feature: 'Integration Panel',
    description: 'Force sync Jira and Salesforce integrations immediately',
    action: 'click',
    selector: `#${ELEMENT_IDS.integrationPanel.forceSyncBtn}`,
    elementId: ELEMENT_IDS.integrationPanel.forceSyncBtn,
    tourSelector: '[data-tour="integrations-force-sync"]',
    speak: {
      before: 'Click Force Sync to immediately re-sync Jira and Salesforce data.',
      after: 'Integration sync queued. Status will update within 30 seconds.',
    },
    pause: { afterMs: 300 },
  },
];

// ─── DESKTOP APPS TOUR ──────────────────────────────────────────────────────
// Walks the Reporting Center, Notes, role switcher, and aegis window close
// controls — i.e. the desktop shell features that surround the aegis app.

export const desktopAppsTour = [
  {
    id: 'open-reporting-center',
    feature: 'Desktop / Bottom Dock',
    description: 'Open the Reporting Center window from the bottom dock',
    action: 'click',
    selector: `#${ELEMENT_IDS.desktop.dockReportingCenterBtn}`,
    elementId: ELEMENT_IDS.desktop.dockReportingCenterBtn,
    tourSelector: '[data-tour="dock-reporting-center"]',
    speak: {
      before: 'The Reporting Center stores all generated reports. Click its dock icon to open it.',
      during: 'Opening Reporting Center…',
      after: 'Reporting Center is open. Reports triggered from the app appear here.',
    },
    pause: { afterMs: 600 },
  },
  {
    id: 'open-notes',
    feature: 'Desktop / Bottom Dock',
    description: 'Open the Notes window from the bottom dock',
    action: 'click',
    selector: `#${ELEMENT_IDS.desktop.dockNotesBtn}`,
    elementId: ELEMENT_IDS.desktop.dockNotesBtn,
    tourSelector: '[data-tour="dock-notes"]',
    speak: {
      before: 'Use Notes to capture quick observations during your shift.',
      during: 'Opening Notes…',
      after: 'Notes window is open. Your notes are persisted between sessions.',
    },
    pause: { afterMs: 600 },
  },
  {
    id: 'role-switcher',
    feature: 'Sidebar Navigation',
    description: 'Open the role switcher panel from the bottom of the sidebar',
    action: 'click',
    selector: `#${ELEMENT_IDS.sidebar.roleSwitcherBtn}`,
    elementId: ELEMENT_IDS.sidebar.roleSwitcherBtn,
    tourSelector: '[data-tour="role-switcher"]',
    speak: {
      before: 'The role avatar at the bottom of the sidebar lets you switch between roles. The panel flies upward.',
      during: 'Opening role switcher…',
      after: 'Role panel is open. Select any role to jump into its dedicated workspace.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'aegis-window-minimize',
    feature: 'App Window — aegis.ai',
    description: 'Minimize the aegis.ai window back to the dock',
    action: 'click',
    selector: `#${ELEMENT_IDS.aegisWindow.minimizeBtn}`,
    elementId: ELEMENT_IDS.aegisWindow.minimizeBtn,
    speak: {
      before: 'Minimize keeps the app running — the dock dot dims to indicate a minimized window.',
      after: 'Window minimized. Click the dock icon again to restore it.',
    },
    pause: { afterMs: 400 },
  },
  {
    id: 'close-aegis-window',
    feature: 'App Window — aegis.ai',
    description: 'Close the aegis.ai application window (clears the role and returns to login)',
    action: 'click',
    selector: `#${ELEMENT_IDS.aegisWindow.closeBtn}`,
    elementId: ELEMENT_IDS.aegisWindow.closeBtn,
    speak: {
      before: 'Click the red close button to exit the aegis.ai window. This logs you out and returns to the role-selection screen.',
      after: 'Window closed. You are back at the Ubuntu-style login.',
    },
    pause: { afterMs: 300 },
  },
];

// ─── FULL PLATFORM DEMO TOUR (composed from above) ──────────────────────────
// Note: Onboarding ends in SUPPORT_LEAD (the desktop dock_aegis_btn click
// auto-sets that role). Each subsequent role-specific tour pre-pends a
// switchToRole step so the demo flows cleanly across all six roles.

export const fullDemoTour = [
  ...onboardingTour,
  ...supportLeadTour,
  ...switchToRole('legal_compliance'),
  ...legalComplianceTour,
  ...switchToRole('vp_customer_success'),
  ...executiveDashboardTour,
  ...switchToRole('admin_ops'),
  ...adminOpsTour,
  ...switchToRole('customer'),
  ...customerPortalTour,
  ...desktopAppsTour,
];

export default fullDemoTour;
