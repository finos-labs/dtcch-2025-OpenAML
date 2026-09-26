Write-Host "Starting OpenKYT Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\Users\DELL\Stsack\dtcch-2025-OpenAML\OpenKYT\backend\api; python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "Starting OpenKYT Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd c:\Users\DELL\Stsack\dtcch-2025-OpenAML\OpenKYT\frontend; npm run dev"

Write-Host "Both services are starting in separate windows."
Write-Host "Backend API: http://localhost:8000"
Write-Host "Frontend App: http://localhost:5173 (usually)"
