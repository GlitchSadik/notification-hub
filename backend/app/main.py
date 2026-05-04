from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.realtime.manager import manager
from app.api.v1.endpoints import router as api_router
from app.seed import seed_db

# Initialize the FastAPI application instance
app = FastAPI(title="Notification API")

# Setup CORS to allow the frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Automated database seeding on application startup
@app.on_event("startup")
def startup_event():
    seed_db()

# Prefix all API routes with /api/v1 for versioning
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Notification System API is running"}

# WebSocket endpoint to handle real-time client communication
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Register the connection with the global manager
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive and listen for incoming messages
            await websocket.receive_text()
    except WebSocketDisconnect:
        # Cleanup connection upon disconnection
        manager.disconnect(websocket)
