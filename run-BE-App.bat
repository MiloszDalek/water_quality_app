start powershell -Command "cd '%~dp0backend'; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload --host 0.0.0.0 --port 8000"

start powershell -Command "cd '%~dp0frontend'; npm run dev"
