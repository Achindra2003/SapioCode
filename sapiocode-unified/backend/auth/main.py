from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import os
import traceback

from auth_routes import router as auth_router
from progress_routes import router as progress_router
from session_routes import router as session_router

app = FastAPI(
    title="SapioCode Auth & Progress API",
    description="Authentication and Progress tracking for SapioCode",
    version="1.0.0",
)

class CORSErrorMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            response = JSONResponse(content={})
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
            return response
        
        try:
            response = await call_next(request)
        except Exception as e:
            print(f"ERROR: {e}")
            traceback.print_exc()
            response = JSONResponse(
                status_code=500,
                content={"detail": str(e), "type": type(e).__name__}
            )
        
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response

app.add_middleware(CORSErrorMiddleware)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(progress_router)
app.include_router(session_router)


@app.get("/")
def health_check():
    return {
        "service": "SapioCode Auth & Progress API",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
