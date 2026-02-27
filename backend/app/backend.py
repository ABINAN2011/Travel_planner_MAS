# backend.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
from langgraph.graph import StateGraph
from fastapi.middleware.cors import CORSMiddleware

from agent import intent_agent, website_agent, itinerary_agent, budget_agent, transport_agent, response_agent

app = FastAPI(title="AI Travel Planner")

# Allow frontend to call backend
origins = [
    "http://localhost:3000",  # your frontend URL
    "http://127.0.0.1:3000",  # optional
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],         # allow all HTTP methods
    allow_headers=["*"],         # allow all headers
)

class ChatRequest(BaseModel):
    message: str


graph = StateGraph(dict)  # <-- Use dict, NOT TravelState class


graph.add_node("intent", intent_agent)
graph.add_node("website", website_agent)
graph.add_node("itinerary", itinerary_agent)
graph.add_node("budget", budget_agent)
graph.add_node("transport", transport_agent)
graph.add_node("response", response_agent)


graph.set_entry_point("intent")


def route(state: Dict):
    return "website" if state.get("is_website_query") else "itinerary"

graph.add_conditional_edges(
    "intent",
    route,
    {"website": "website", "itinerary": "itinerary"}
)


graph.add_edge("itinerary", "budget")
graph.add_edge("budget", "transport")
graph.add_edge("transport", "response")


graph.add_edge("website", "response")
    B 11
graph.set_finish_point("response")

# Compile graph
travel_graph = graph.compile()

# ---------------- API Endpoint ----------------
@app.post("/chat")
def chat(req: ChatRequest):
    state = travel_graph.invoke({"message": req.message})  # invoke() on dict works
    return {"reply": state["response"]}  # guaranteed response
