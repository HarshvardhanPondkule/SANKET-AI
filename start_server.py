"""
Production startup script for Sanket backend
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "run_backend:app",
        host="0.0.0.0",
        port=8000,
        reload=False,  # Disable reload for now
        log_level="info"
    )
