@echo off

echo Starting Ollama Proxy service...
cd /d E:\ArticleBot\ollama-proxy
start "" node proxy-server.js

echo Starting Ollama service...
start "" "E:\software\Ollama\ollama.exe" serve

echo Both services have been started, WebSocket server is listening on port 3001
pause
