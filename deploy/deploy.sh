#!/bin/bash

# =============================================================================
# Script de Despliegue para Link Holder
# URL: link.urarara.online
# IP: 38.250.161.165
# =============================================================================

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
APP_NAME="linkholder"
APP_DIR="/var/www/linkholder"
DOMAIN="link.urarara.online"
REPO_URL="TU_REPOSITORIO_GIT_AQUI"  # Cambia esto por tu URL de Git

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Desplegando Link Holder             ${NC}"
echo -e "${GREEN}========================================${NC}"

# Función para imprimir pasos
step() {
    echo -e "\n${YELLOW}>>> $1${NC}"
}

# =============================================================================
# PASO 1: Actualizar sistema
# =============================================================================
step "Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# =============================================================================
# PASO 2: Instalar dependencias del sistema
# =============================================================================
step "Instalando dependencias..."
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    nginx \
    certbot \
    python3-certbot-nginx \
    git \
    curl \
    nodejs \
    npm

# Instalar Node.js LTS si es muy antigua
if ! command -v node &> /dev/null || [[ $(node -v | cut -d. -f1 | tr -d 'v') -lt 18 ]]; then
    step "Instalando Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# =============================================================================
# PASO 3: Crear estructura de directorios
# =============================================================================
step "Creando estructura de directorios..."
sudo mkdir -p $APP_DIR
sudo mkdir -p /var/log/gunicorn
sudo mkdir -p /var/www/certbot

# =============================================================================
# PASO 4: Clonar o actualizar repositorio
# =============================================================================
step "Clonando/Actualizando repositorio..."
if [ -d "$APP_DIR/.git" ]; then
    cd $APP_DIR
    sudo git pull origin main
else
    sudo git clone $REPO_URL $APP_DIR
fi

cd $APP_DIR

# =============================================================================
# PASO 5: Configurar Backend (Django)
# =============================================================================
step "Configurando backend..."

# Crear entorno virtual
if [ ! -d "venv" ]; then
    sudo python3 -m venv venv
fi

# Activar entorno virtual e instalar dependencias
sudo $APP_DIR/venv/bin/pip install --upgrade pip
sudo $APP_DIR/venv/bin/pip install -r requirements.txt

# Configurar .env de producción (IMPORTANTE: editar manualmente después)
if [ ! -f "backend/.env" ]; then
    step "Creando archivo .env para backend..."
    sudo cp backend/.env.example backend/.env
    echo -e "${RED}¡IMPORTANTE! Edita backend/.env con tu SECRET_KEY${NC}"
fi

# Migraciones de Django
cd backend
sudo $APP_DIR/venv/bin/python manage.py migrate --no-input
sudo $APP_DIR/venv/bin/python manage.py collectstatic --no-input
cd ..

# =============================================================================
# PASO 6: Configurar Frontend (React)
# =============================================================================
step "Configurando frontend..."
cd frontend
sudo npm install
sudo npm run build
cd ..

# =============================================================================
# PASO 7: Configurar permisos
# =============================================================================
step "Configurando permisos..."
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR

# =============================================================================
# PASO 8: Configurar Gunicorn
# =============================================================================
step "Configurando Gunicorn service..."
sudo cp deploy/gunicorn.service /etc/systemd/system/linkholder.service
sudo systemctl daemon-reload
sudo systemctl enable linkholder
sudo systemctl restart linkholder

# =============================================================================
# PASO 9: Configurar Nginx
# =============================================================================
step "Configurando Nginx..."
sudo cp deploy/nginx.conf /etc/nginx/sites-available/linkholder
sudo ln -sf /etc/nginx/sites-available/linkholder /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Verificar configuración de Nginx
sudo nginx -t

# =============================================================================
# PASO 10: Obtener certificado SSL
# =============================================================================
step "Configurando SSL con Let's Encrypt..."
# Primero, necesitamos Nginx corriendo con HTTP para el desafío ACME
# Temporalmente usar configuración HTTP only
sudo systemctl restart nginx

# Obtener certificado
sudo certbot certonly --webroot -w /var/www/certbot \
    -d $DOMAIN \
    --non-interactive \
    --agree-tos \
    --email tu-email@ejemplo.com \
    || echo -e "${YELLOW}Certificado SSL no obtenido. Configura manualmente con: sudo certbot --nginx -d $DOMAIN${NC}"

# Reiniciar Nginx con SSL
sudo systemctl restart nginx

# =============================================================================
# PASO 11: Verificación final
# =============================================================================
step "Verificación final..."

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}   Despliegue completado!              ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "URL: https://$DOMAIN"
echo -e "IP: 38.250.161.165"
echo ""
echo -e "${YELLOW}Comandos útiles:${NC}"
echo "  - Ver logs de Gunicorn: sudo journalctl -u linkholder -f"
echo "  - Reiniciar backend: sudo systemctl restart linkholder"
echo "  - Reiniciar Nginx: sudo systemctl restart nginx"
echo "  - Ver logs de Nginx: sudo tail -f /var/log/nginx/linkholder_error.log"
echo ""
echo -e "${RED}TAREAS PENDIENTES:${NC}"
echo "  1. Editar backend/.env con una SECRET_KEY segura"
echo "  2. Configurar el email en certbot si no se obtuvo el certificado"
echo "  3. Configurar firewall: sudo ufw allow 'Nginx Full'"
