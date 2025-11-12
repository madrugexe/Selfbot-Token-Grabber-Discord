@echo off
chcp 65001 >nul
title Ghost Bot - Kaicord Controller
mode con: cols=80 lines=25


set "ESC="
set "RESET=%ESC%[0m"
set "BOLD=%ESC%[1m"
set "RED=%ESC%[91m"
set "GREEN=%ESC%[92m"
set "YELLOW=%ESC%[93m"
set "BLUE=%ESC%[94m"
set "MAGENTA=%ESC%[95m"
set "CYAN=%ESC%[96m"
set "WHITE=%ESC%[97m"

cls
echo.
echo %BOLD%%MAGENTA%  ██████  ██   ██  ██████  ███████ ████████     ██████   ██████  ████████ 
echo %BOLD%%MAGENTA% ██       ██   ██ ██    ██ ██         ██        ██   ██ ██    ██    ██    
echo %BOLD%%MAGENTA% ██   ███ ███████ ██    ██ ███████    ██        ██████  ██    ██    ██    
echo %BOLD%%MAGENTA% ██    ██ ██   ██ ██    ██      ██    ██        ██   ██ ██    ██    ██    
echo %BOLD%%MAGENTA%  ██████  ██   ██  ██████  ███████    ██        ██████   ██████     ██    
echo %RESET%
echo %BOLD%%CYAN%                  ================================
echo %BOLD%%CYAN%                        BY FRAXX AND MADRUG
echo %BOLD%%CYAN%                  ================================
echo %RESET%
echo.


node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%❌ ERREUR : Node.js n'est pas installé ou n'est pas dans le PATH
    echo.
    echo %YELLOW%Veuillez installer Node.js depuis : https://nodejs.org/
    echo %RESET%
    pause
    exit /b 1
)


if not exist "package.json" (
    echo %RED%❌ ERREUR : package.json introuvable
    echo %YELLOW%Assurez-vous d'être dans le bon répertoire
    echo %RESET%
    pause
    exit /b 1
)


if not exist "node_modules" (
    echo %YELLOW%📦 Installation des dépendances...%RESET%
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo %RED%❌ Erreur lors de l'installation des dépendances
        echo %RESET%
        pause
        exit /b 1
    )
    echo.
)


echo %GREEN%✓%RESET% Node.js version: %BOLD%%CYAN%
node --version
echo %RESET%%GREEN%✓%RESET% Répertoire: %BOLD%%YELLOW%%cd%
echo %RESET%
echo %BOLD%%WHITE%Initialisation du serveur...%RESET%
echo.


echo %BOLD%%GREEN%🚀 Démarrage de Ghost Bot...%RESET%
echo %CYAN%────────────────────────────────────────────────────────────────%RESET%
echo.

timeout /t 2 /nobreak >nul


node index.js


echo.
echo %CYAN%────────────────────────────────────────────────────────────────%RESET%
echo %YELLOW%Le serveur s'est arrêté.%RESET%
echo.
pause
