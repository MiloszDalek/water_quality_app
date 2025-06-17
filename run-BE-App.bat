start powershell -NoExit -Command "cd '%~dp0FastAPI'; .\..\env\Scripts\Activate.ps1; uvicorn main:app --reload --host 0.0.0.0 --port 8000"

start powershell -NoExit -Command "cd '%~dp0react-app'; npm run dev"
