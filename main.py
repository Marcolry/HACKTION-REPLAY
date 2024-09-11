from fastapi import FastAPI
from fastapi.responses import FileResponse
import uvicorn

app = FastAPI()

# Route pour la page d'accueil (index.html)
@app.get("/")
async def read_index():
    return FileResponse("index.html")

# Route pour gomoku.html
@app.get("/gomoku.html")
async def read_gomoku():
    return FileResponse("gomoku.html")

# Route pour menu.html
@app.get("/menu.html")
async def read_menu():
    return FileResponse("menu.html")

# Route pour tictactoe.html
@app.get("/tictactoe.html")
async def read_tictactoe():
    return FileResponse("tictactoe.html")

# Route pour 404.html
@app.get("/404.html")
async def read_404():
    return FileResponse("404.html")

# Fallback pour toutes les autres routes
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    return FileResponse("404.html")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
