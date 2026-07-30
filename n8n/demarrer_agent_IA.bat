@echo off
chcp 65001 >nul
title Demarrage Agent IA n8n
color 0A

echo ============================================
echo    DEMARRAGE DE L'AGENT IA (n8n + Ollama + MCP)
echo ============================================
echo.

echo [1/4] Ollama...
start "Ollama" cmd /k "ollama serve"
timeout /t 3 >nul

echo [2/4] n8n...
start "n8n" cmd /k "n8n"
timeout /t 3 >nul

echo [3/4] Serveur MCP - everything (add, echo...)...
start "MCP Everything" cmd /k "npx -y @modelcontextprotocol/server-everything streamableHttp"
timeout /t 2 >nul

echo [4/4] Serveur MCP - filesystem (lecture/ecriture fichiers)...
start "MCP Filesystem" cmd /k "npx -y supergateway --stdio ^"npx -y @modelcontextprotocol/server-filesystem C:\Users\Admin\.n8n-files^""
timeout /t 2 >nul

echo.
echo ============================================
echo   Tout est lance dans des fenetres separees.
echo   NE LES FERME PAS pendant l'utilisation.
echo ============================================
echo.
echo   Attends ~15 secondes que tout demarre...
timeout /t 15 >nul

echo   Ouverture de n8n dans le navigateur...
start "" http://localhost:5678

echo.
echo   RAPPEL : dans n8n, relance l'ingestion RAG
echo   (bouton play sur le node "When clicking Execute workflow")
echo   sinon la base de documents sera vide.
echo.
echo   Tu peux fermer CETTE fenetre (pas les autres).
pause >nul
