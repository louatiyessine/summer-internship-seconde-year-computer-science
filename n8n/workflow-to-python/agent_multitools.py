from langchain_ollama import ChatOllama , OllamaEmbeddings
from langchain_core.tools import tool
from langchain_core.vectorstores import InMemoryVectorStore
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
import requests
import glob
model=ChatOllama(model="llama3.2")
@tool
def addition(a: float, b: float) -> float:
    """Add two numbers together."""
    return a + b
@tool
def subtraction(a: float, b: float) -> float:
    """Subtract two numbers."""
    return a - b
@tool
def multiplication(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b
@tool
def meteo(ville:str) -> str:
    """ donne la metéo actuelle d'une ville"""
    url="https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": ville,
        "appid": "aaa721629619b4371003eb3753489257",
        "units": "metric",
        "lang": "fr"
    }
    data = requests.get(url, params=params).json()
    return f"La météo actuelle à {ville} est de {data['main']['temp']}°C avec {data['weather'][0]['description']}."

embeddings = OllamaEmbeddings(model="nomic-embed-text")
vectorstore = InMemoryVectorStore(embeddings)
 
for chemin in glob.glob(r"C:\Users\Admin\.n8n-files\*.txt"):
    with open(chemin, encoding="utf-8") as f:
        vectorstore.add_texts([f.read()])
 
retriever = vectorstore.as_retriever()
@tool 
def recherche_documents(question:str) -> str:
    """cherche des informations dans les documents """
    docs= retriever.invoke(question)
    return "\n\n".join(d.page_content for d in docs)

memory = MemorySaver()
agent = create_react_agent(
    model,
    tools=[addition, subtraction, multiplication, meteo, recherche_documents],
    checkpointer=memory,
)
config = {"configurable": {"thread_id": "conversation-1"}}
while True:
    question = input("\nToi: ")
    if question.lower() in ("exit", "quit", "stop"):
        break
    resultat = agent.invoke({"messages": [("human", question)]}, config)
    print("Agent:", resultat["messages"][-1].content)

        