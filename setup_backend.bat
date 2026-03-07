@echo off
REM Setup backend environment and download data

REM Ensure you're running from project root
cd /d "%~dp0"

echo Creating virtual environment...
python -m venv .venv
if %errorlevel% neq 0 (
    echo Failed to create venv, make sure Python is installed and on PATH.
    goto end
)













:end
goto end
necho Setup complete. You can now run: python backend\api.pypython backend\scripts\geocode_stations.pypython backend\download_chennai_data.pypython backend\download_aqi_data.py
necho Downloading datasets...python -m pip install -r backend\requirements.txtpython -m pip install --upgrade pip
necho Installing requirements...call .venv\Scripts\activatenecho Activating venv...