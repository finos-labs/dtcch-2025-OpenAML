Start-Process powershell -ArgumentList "-NoExit -Command `"cd .\OpenKYT\backend\api; uvicorn main:app --reload`""
Start-Process powershell -ArgumentList "-NoExit -Command `"cd .\OpenKYT\frontend; npm run dev`""
Write-Host "Started backend and frontend in separate windows."
