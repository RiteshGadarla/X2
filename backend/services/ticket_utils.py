import json

SLA_PRIORITY_RANK = {
    "Critical": 0,
    "High": 1,
    "Medium": 2,
    "Low": 3
}

TICKET_PRIORITY_RANK = {
    "P1": 0,
    "P2": 1,
    "P3": 2,
    "P4": 3
}

CUSTOMER_TIER_RANK = {
    "Enterprise": 0,
    "Business": 1,
    "Standard": 2
}


def parse_time_remaining_minutes(time_remaining):
    if not time_remaining:
        return 0
    total = 0
    # Handle cases like "1d 4h", "22m", etc.
    for part in str(time_remaining).split():
        if part.endswith("d"):
            total += int(part[:-1]) * 24 * 60
        elif part.endswith("h"):
            total += int(part[:-1]) * 60
        elif part.endswith("m"):
            total += int(part[:-1])
    return total


def get_sla_priority(time_remaining):
    minutes = parse_time_remaining_minutes(time_remaining)
    if minutes <= 60:
        return "Critical"
    if minutes <= 4 * 60:
        return "High"
    if minutes <= 8 * 60:
        return "Medium"
    return "Low"


def enrich_ticket_sort_fields(ticket):
    time_rem = ticket.get("time_remaining", "0m")
    sla_priority = get_sla_priority(time_rem)

    return {
        **ticket,
        "sla_priority": sla_priority,
        "sla_priority_rank": SLA_PRIORITY_RANK.get(sla_priority, 99),
        "priority_rank": TICKET_PRIORITY_RANK.get(ticket.get("priority"), 99),
        "customer_tier_rank": CUSTOMER_TIER_RANK.get(ticket.get("tier"), 99),
        "time_remaining_minutes": parse_time_remaining_minutes(time_rem)
    }
