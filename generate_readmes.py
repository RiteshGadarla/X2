import os

ROLES_INFO = [
    {
        "name": "Support Agent",
        "features": ["Ticket Queue", "SLA Compliance Dashboard", "Knowledge Base Editor"],
        "permissions": ["VIEW_TICKETS", "VIEW_SLA", "VIEW_HIL_STATUS", "DRAFT_KB"],
        "controls": [
            {"id": "nav_dashboard_btn", "desc": "Navigate to Home Dashboard"},
            {"id": "nav_tickets_btn", "desc": "Navigate to Ticket Queue"},
            {"id": "nav_metrics_btn", "desc": "Navigate to SLA Metrics"},
            {"id": "nav_hil_btn", "desc": "Navigate to HIL Status Reader"},
            {"id": "nav_kb_btn", "desc": "Navigate to KB Editor"},
            {"id": "nav_logout_btn", "desc": "Logout user profile"}
        ]
    },
    {
        "name": "Support Manager",
        "features": ["Ticket Queue", "SLA Compliance Dashboard", "Knowledge Base Editor", "HIL Review Board"],
        "permissions": ["VIEW_TICKETS", "VIEW_SLA", "VIEW_HIL_STATUS", "DRAFT_KB", "MANAGE_AGENT_CONFIG", "APPROVE_HIL", "PUBLISH_KB", "VIEW_SENTIMENT"],
        "controls": [
            {"id": "nav_dashboard_btn", "desc": "Navigate to Home Dashboard"},
            {"id": "nav_tickets_btn", "desc": "Navigate to Ticket Queue"},
            {"id": "nav_metrics_btn", "desc": "Navigate to SLA Metrics"},
            {"id": "nav_hil_btn", "desc": "Navigate to HIL Approvals Board"},
            {"id": "nav_kb_btn", "desc": "Navigate to KB Editor"},
            {"id": "hil_approve_all_btn", "desc": "Approve all pending HIL requests"},
            {"id": "hil_review_queue_btn", "desc": "Enter interactive HIL approval queue"},
            {"id": "nav_logout_btn", "desc": "Logout user profile"}
        ]
    },
    {
        "name": "VP Customer Success",
        "features": ["Executive Dashboard", "HIL Review Board (Override)", "Voice of Customer Panel"],
        "permissions": ["APPROVE_HIL_OVERRIDE", "VIEW_EXEC_DASH", "VIEW_VOC", "VIEW_HIL_STATUS", "VIEW_SLA"],
        "controls": [
            {"id": "nav_dashboard_btn", "desc": "Navigate to Executive Dashboard"},
            {"id": "nav_metrics_btn", "desc": "Navigate to SLA Metrics"},
            {"id": "nav_hil_btn", "desc": "Navigate to HIL Approvals (Override)"},
            {"id": "voc_export_report_btn", "desc": "Export Monthly Customer CSAT Trend Report"},
            {"id": "nav_logout_btn", "desc": "Logout user profile"}
        ]
    },
    {
        "name": "Legal / Compliance",
        "features": ["Legal Ticket Queue", "Legal Correspondence Review"],
        "permissions": ["VIEW_LEGAL_TICKETS", "MANAGE_LEGAL_CORRESPONDENCE", "VIEW_HIL_STATUS"],
        "controls": [
            {"id": "nav_dashboard_btn", "desc": "Navigate to Home Dashboard"},
            {"id": "nav_hil_btn", "desc": "Navigate to Legal Review Board"},
            {"id": "nav_logout_btn", "desc": "Logout user profile"}
        ]
    },
    {
        "name": "Admin / Ops",
        "features": ["Integration Settings", "Channel Volume Metrics", "Role Simulator"],
        "permissions": ["MANAGE_INTEGRATIONS", "VIEW_CHANNEL_VOL", "MANAGE_AGENT_CONFIG"],
        "controls": [
            {"id": "nav_dashboard_btn", "desc": "Navigate to Home Dashboard"},
            {"id": "nav_settings_btn", "desc": "Navigate to Integrations Control Panel"},
            {"id": "nav_logout_btn", "desc": "Logout user profile"}
        ]
    }
]

os.makedirs('docs/roles', exist_ok=True)

for role in ROLES_INFO:
    filename = f"docs/roles/{role['name'].replace(' ', '_').replace('/', '_')}_README.md"
    with open(filename, "w") as f:
        f.write(f"# Role: {role['name']}\n\n")
        f.write("## Accessible Features\n")
        for feat in role['features']:
            f.write(f"- {feat}\n")
        f.write("\n## Permissions List\n")
        for perm in role['permissions']:
            f.write(f"- `{perm}`\n")
        f.write("\n## Available UI Controls\n")
        f.write("| Action Description | Control ID |\n")
        f.write("|-------------------|-------------|\n")
        for ctrl in role['controls']:
            f.write(f"| {ctrl['desc']} | `<{ctrl['id']}>` |\n")
        
print("Successfully generated all role READMEs.")
