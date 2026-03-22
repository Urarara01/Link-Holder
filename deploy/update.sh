#!/bin/bash

# =============================================================================
# Script de Actualización Rápida para Link Holder
# Usar después de hacer cambios en el código
# =============================================================================

set -e

APP_DIR="/var/www/linkholder"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Actualizando Link Holder...${NC}"

cd $APP_DIR

# Obtener últimos cambios
echo -e "${YELLOW}>>> Pulling cambios...${NC}"
sudo git pull origin main

# Backend
echo -e "${YELLOW}>>> Actualizando backend...${NC}"
sudo $APP_DIR/venv/bin/pip install -r requirements.txt
cd backend
sudo $APP_DIR/venv/bin/python manage.py migrate --no-input
sudo $APP_DIR/venv/bin/python manage.py collectstatic --no-input
cd ..

# Frontend
echo -e "${YELLOW}>>> Actualizando frontend...${NC}"
cd frontend
sudo npm install
sudo npm run build
cd ..

# Permisos
sudo chown -R www-data:www-data $APP_DIR

# Reiniciar servicios
echo -e "${YELLOW}>>> Reiniciando servicios...${NC}"
sudo systemctl restart linkholder
sudo systemctl restart nginx

echo -e "${GREEN}¡Actualización completada!${NC}"
