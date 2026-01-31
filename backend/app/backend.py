from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
from langgraph.graph import StateGraph

from agent import (
    intent_agent,
    website_agent,
    itinerary_agent,
    budget_agent,
     transport_agent,
    response_agent
)

app = FastAPI()



class ChatRequest(BaseModel):
    message: str



class TravelState(Dict):
    message: str



graph = StateGraph(TravelState)

graph.add_node("intent", intent_agent)
graph.add_node("website", website_agent)
graph.add_node("itinerary", itinerary_agent)
graph.add_node("budget", budget_agent)
graph.add_node("transport", transport_agent)
graph.add_node("response", response_agent)

graph.set_entry_point("intent")



def route(state: Dict):
    if state.get("is_website_query"):
        return "website"
    return "itinerary"


graph.add_conditional_edges(
    "intent",
    route,
    {
        "website": "website",
        "itinerary": "itinerary"
    }
)

graph.add_edge("itinerary", "budget")
graph.add_edge("budget", "transport")
graph.add_edge("transport", "response")

graph.set_finish_point("response")

travel_graph = graph.compile()


@app.post("/chat")
def chat(req: ChatRequest):
    result = travel_graph.invoke({"message": req.message})
    return {"reply": result["response"]}
