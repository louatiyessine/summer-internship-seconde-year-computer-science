import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_ollama import ChatOllama
from langgraph.prebuilt import create_react_agent
client = MultiServerMCPClient({
    "everything":{
        "command":"npx",
        "args": ["-y", "@modelcontextprotocol/server-everything"],
        "transport": "stdio",
    },
    "filesystem": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", r"C:\licence informatique\summer internship 2eme bachlor\n8n\documents"],
        "transport": "stdio",
    },
}
    
)
model=ChatOllama(model="qwen3:4b")
async def main():
    tools=await client.get_tools()
    print(f"{len(tools)} tools loaded from MCP servers.")
    agent = create_react_agent(model, tools=tools)

    while True:
        question = input("\nToi: ")
        if question.lower() in ("exit", "quit", "stop"):
            break
        resultat = await agent.ainvoke({"messages": [("human", question)]})
        print("Agent:", resultat["messages"][-1].content)
asyncio.run(main())