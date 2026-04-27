"""
Deterministic priority calculation.

Factors (weights):
  customer tier        : enterprise=3, business=2, standard=1
  user impact          : all_users=3, many_users=2, single_user=1
  functionality crit.  : critical=3, major=2, minor=1
  sentiment            : angry=3, negative=2, neutral=1, positive=0
  ticket type bonus    : legal=+2, billing=+1, infrastructure=+1, enhancement=-1, training=-1

Score → priority:
  >= 11  → P1
  >= 7   → P2
  >= 4   → P3
  <  4   → P4

Hard overrides applied after score:
  ticket_type == "legal"   → minimum P2
  is_vip == True           → bump one level (P3→P2, P4→P3, etc.)
"""

_TIER_WEIGHT = {"enterprise": 3, "business": 2, "standard": 1}
_IMPACT_WEIGHT = {"all_users": 3, "many_users": 2, "single_user": 1}
_CRIT_WEIGHT = {"critical": 3, "major": 2, "minor": 1}
_SENTIMENT_WEIGHT = {"angry": 3, "negative": 2, "neutral": 1, "positive": 0}
_TYPE_BONUS = {
    "legal": 2, "billing": 1, "infrastructure": 1,
    "bug": 0, "access": 0, "data": 0, "performance": 0,
    "enhancement": -1, "training": -1,
}

_ORDER = {"P1": 1, "P2": 2, "P3": 3, "P4": 4}


def _score_to_priority(score: int) -> str:
    if score >= 11:
        return "P1"
    if score >= 7:
        return "P2"
    if score >= 4:
        return "P3"
    return "P4"


def _bump_up(priority: str) -> str:
    mapping = {"P4": "P3", "P3": "P2", "P2": "P1", "P1": "P1"}
    return mapping.get(priority, priority)


def _higher(a: str, b: str) -> str:
    """Return the higher-severity (lower number) priority."""
    return a if _ORDER.get(a, 4) <= _ORDER.get(b, 4) else b


def calculate_priority(
    tier: str,
    user_impact: str = "single_user",
    functionality_criticality: str = "minor",
    sentiment: str = "neutral",
    ticket_type: str = "bug",
    is_vip: bool = False,
) -> str:
    score = (
        _TIER_WEIGHT.get(tier, 1)
        + _IMPACT_WEIGHT.get(user_impact, 1)
        + _CRIT_WEIGHT.get(functionality_criticality, 1)
        + _SENTIMENT_WEIGHT.get(sentiment, 1)
        + _TYPE_BONUS.get(ticket_type, 0)
    )

    priority = _score_to_priority(score)

    # Hard override: legal tickets always at least P2
    if ticket_type == "legal":
        priority = _higher(priority, "P2")

    # VIP bump
    if is_vip:
        priority = _bump_up(priority)

    return priority
