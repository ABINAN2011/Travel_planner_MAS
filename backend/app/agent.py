# agent.py
from typing import Dict

def intent_agent(state: Dict):
    msg = state.get("message", "").lower()
    state["is_website_query"] = any(word in msg for word in ["website", "sites", "best place", "suggest"])
    state["destination"] = "Nuwara Eliya" if "nuwara" in msg else "Unknown"
    state["days"] = 4 if "4" in msg else 3
    if "low" in msg:
        state["budget_type"] = "Low"
    elif "high" in msg:
        state["budget_type"] = "High"
    else:
        state["budget_type"] = "Medium"
    return state

def website_agent(state: Dict):
    state["response"] = """
🌍 Best Websites to Find Travel Destinations

TripAdvisor: https://www.tripadvisor.com  
Lonely Planet: https://www.lonelyplanet.com  
Google Travel: https://www.google.com/travel  
Atlas Obscura: https://www.atlasobscura.com  
Sri Lanka: https://www.srilanka.travel | https://www.visitsrilankaplaces.com
"""
    return state

def itinerary_agent(state: Dict):
    state["itinerary"] = [
        "Day 1: Travel & city walk",
        "Day 2: Tea plantation & Gregory Lake",
        "Day 3: Horton Plains",
        "Day 4: Shopping & return"
    ]
    return state

def budget_agent(state: Dict):
    budget_type = state.get("budget_type", "Medium")
    if budget_type == "Low":
        state["budget"] = "LKR 30,000 – 40,000"
    elif budget_type == "High":
        state["budget"] = "LKR 70,000+"
    else:
        state["budget"] = "LKR 50,000+"
    return state

def transport_agent(state: Dict):
    state["transport"] = "Train (Colombo → Nanu Oya)"
    state["stay"] = "Budget guest house"
    return state

def response_agent(state: Dict):
    if state.get("is_website_query") and "response" in state:
        return state

    destination = state.get("destination", "Unknown")
    days = state.get("days", 3)
    budget = state.get("budget", "LKR 50,000+")
    itinerary = state.get("itinerary", ["No itinerary available"])
    transport = state.get("transport", "Not specified")
    stay = state.get("stay", "Not specified")

    state["response"] = f"""
 Travel Plan for {destination}

🗓 Duration: {days} days
 Budget: {budget}

 Itinerary:
{chr(10).join(itinerary)}

 Transport: {transport}
 Stay: {stay}
"""
    return state
