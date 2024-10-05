from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/api/test")
async def test_endpoint():
    return JSONResponse(content={"message": "GET request successful!"})
