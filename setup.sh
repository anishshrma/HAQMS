#!/bin/bash

# HAQMS Setup Orchestrator
# Exit immediately if a command exits with a non-zero status
set -e

# Visual colors
GREEN='\033[0;32m'
TEAL='\033[0;36m'
AMBER='\033[1;33m'
RED='\033[0;31m'
NC='\033[0;50m' # No Color
BOLD='\033[1m'

echo -e "${TEAL}${BOLD}====================================================================${NC}"
echo -e "${TEAL}${BOLD}    __  ______   ____  __  ________      ____  ____  ____  __ __   ${NC}"
echo -e "${TEAL}${BOLD}   / / / / __ | / __ \/  |/  / ___/     / __ \/ __ )/ __ \/ //_/   ${NC}"
echo -e "${TEAL}${BOLD}  / /_/ / /_/ // / / / /|_/ /\__ \     / / / / /_/ / /_/ / ,<      ${NC}"
echo -e "${TEAL}${BOLD} / __  / __  // /_/ / /  / /___/ /    / /_/ / _, _/ _, _/ /| |     ${NC}"
echo -e "${TEAL}${BOLD}/_/ /_/_/ |_/ \___\_/_/  /_/____/     \____/_/ |_/_/ |_/_/ |_|     ${NC}"
echo -e "${TEAL}${BOLD}                                                                    ${NC}"
echo -e "${TEAL}${BOLD}          Hospital Appointment & Queue Management System            ${NC}"
echo -e "${TEAL}${BOLD}====================================================================${NC}"
echo -e "Starting candidate environment auto-provisioning...\n"

# Verify Node.js presence
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed. Please install Node.js v18+ and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}[1/4]${NC} Installing workspace root dependencies..."
npm install

echo -e "\n${GREEN}[2/4]${NC} Provisioning express backend dependencies..."
cd backend
npm install
cd ..

echo -e "\n${GREEN}[3/4]${NC} Provisioning nextjs frontend dependencies..."
cd frontend
npm install
cd ..

echo -e "\n${GREEN}[4/4]${NC} Preparing setup files..."
# Create backend .env from .env.example if not exists
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "Created backend/.env from template."
fi

echo -e "\n===================================================================="
echo -e "${GREEN}${BOLD}Success! HAQMS installation is complete.${NC}"
echo -e "===================================================================="
echo -e "\n${AMBER}Next Steps to Launch the Application:${NC}"
echo -e "1. Start your local PostgreSQL server or spin up the pre-configured docker container:"
echo -e "   ${BOLD}docker-compose up -d${NC}"
echo -e ""
echo -e "2. Apply migrations & seed the database with robust candidate mock data:"
echo -e "   ${BOLD}npm run db:setup --prefix backend${NC}"
echo -e ""
echo -e "3. Boot both Next.js and Express development servers concurrently:"
echo -e "   ${BOLD}npm run dev${NC}"
echo -e ""
echo -e "--------------------------------------------------------------------"
echo -e "Front-end: http://localhost:3000"
echo -e "Back-end API: http://localhost:5000"
echo -e "===================================================================="
