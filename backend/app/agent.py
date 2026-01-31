# agents.py

from typing import Dict

# ---------------- Intent Agent ----------------
def intent_agent(state: Dict):
    msg = state["message"].lower()

    state["is_website_query"] = any(
        word in msg for word in ["website", "sites", "best place", "suggest"]
    )

    state["destination"] = "Nuwara Eliya" if "nuwara" in msg else "Unknown"
    state["days"] = 4 if "4" in msg else 3
    state["budget_type"] = "Low" if "low" in msg else "Medium"

    return state


# ---------------- Website Agent ----------------
def website_agent(state: Dict):
    state["response"] = """
🌍 **Best Websites to Find Travel Destinations**

🔹 **TripAdvisor**
https://www.tripadvisor.com  
✔ Reviews, attractions, real traveler photos

🔹 **Lonely Planet**
https://www.lonelyplanet.com  
✔ Trusted travel guides & itineraries

🔹 **Google Travel**
https://www.google.com/travel  
✔ Destinations, hotels, maps

🔹 **Atlas Obscura**
https://www.atlasobscura.com  
✔ Hidden & unique places

🇱🇰 **Sri Lanka Specific**
🔹 https://www.srilanka.travel  
🔹 https://www.visitsrilankaplaces.com  

✨ These websites help you discover the best places to visit.
"""
    return state


# ---------------- Itinerary Agent ----------------
def itinerary_agent(state: Dict):
    state["itinerary"] = [
        "Day 1: Travel & city walk",
        "Day 2: Tea plantation & Gregory Lake",
        "Day 3: Horton Plains",
        "Day 4: Shopping & return"
    ]
    return state


# ---------------- Budget Agent ----------------
def budget_agent(state: Dict):
    if state["budget_type"] == "Low":
        state["budget"] = "LKR 30,000 – 40,000"
    else:
        state["budget"] = "LKR 50,000+"
    return state


# ---------------- Transport Agent ----------------
def transport_agent(state: Dict):
    state["transport"] = "Train (Colombo → Nanu Oya)"
    state["stay"] = "Budget guest house"
    return state


# ---------------- Response Agent ----------------
def response_agent(state: Dict):
    state["response"] = f"""
🌍 **Travel Plan for {state['destination']}**

🗓 Duration: {state['days']} days  
💰 Budget: {state['budget']}  

📌 **Itinerary**
{chr(10).join(state['itinerary'])}

🚆 Transport: {state['transport']}
🏨 Stay: {state['stay']}

✨ Have a great trip!
"""
    return state
