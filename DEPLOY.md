# 🚀 Guía de Despliegue - Link Holder

**URL:** https://link.urarara.online  
**IP del VPS:** 38.250.161.165

---

## 📋 Requisitos Previos

- VPS con Ubuntu 22.04+ (o Debian 11+)
- Acceso SSH como root o usuario con sudo
- Dominio `link.urarara.online` apuntando a `38.250.161.165`
- Git instalado en el VPS

---

## 🔧 Despliegue Inicial

### Opción 1: Script Automático (Recomendado)

1. **Conecta al VPS:**
   ```bash
   ssh root@38.250.161.165
   ```

2. **Descarga y ejecuta el script:**
   ```bash
   # Clonar repositorio
   git clone TU_REPOSITORIO /var/www/linkholder
   cd /var/www/linkholder
   
   # Dar permisos y ejecutar
   chmod +x deploy/deploy.sh
   ./deploy/deploy.sh
   ```

3. **Configura el archivo .env:**
   ```bash
   nano /var/www/linkholder/backend/.env
   ```
   
   Genera una SECRET_KEY segura:
   ```bash
   python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

---

### Opción 2: Despliegue Manual

#### 1. Instalar dependencias del sistema

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv nginx certbot python3-certbot-nginx git curl

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 2. Crear estructura de directorios

```bash
sudo mkdir -p /var/www/linkholder
sudo mkdir -p /var/log/gunicorn
```

#### 3. Clonar repositorio

```bash
cd /var/www
sudo git clone TU_REPOSITORIO linkholder
cd linkholder
```

#### 4. Configurar Backend (Django)

```bash
# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp backend/.env.example backend/.env
nano backend/.env  # Editar con values de producción

# Migraciones y archivos estáticos
cd backend
python manage.py migrate
python manage.py collectstatic --no-input
cd ..
```

#### 5. Configurar Frontend (React)

```bash
cd frontend
npm install
npm run build
cd ..
```

#### 6. Configurar permisos

```bash
sudo chown -R www-data:www-data /var/www/linkholder
sudo chmod -R 755 /var/www/linkholder
```

#### 7. Configurar Gunicorn

```bash
sudo cp deploy/gunicorn.service /etc/systemd/system/linkholder.service
sudo systemctl daemon-reload
sudo systemctl enable linkholder
sudo systemctl start linkholder
```

#### 8. Configurar Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/linkholder
sudo ln -s /etc/nginx/sites-available/linkholder /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

#### 9. Configurar SSL

```bash
sudo certbot --nginx -d link.urarara.online
```

#### 10. Configurar Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

---

## 🔄 Actualización del Código

Después de hacer cambios en el código:

```bash
cd /var/www/linkholder
chmod +x deploy/update.sh
./deploy/update.sh
```

O manualmente:

```bash
cd /var/www/linkholder
git pull origin main

# Backend
source venv/bin/activate
pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py collectstatic --no-input
cd ..

# Frontend
cd frontend
npm install
npm run build
cd ..

# Reiniciar servicios
sudo systemctl restart linkholder
sudo systemctl restart nginx
```

---

## 📊 Comandos Útiles

### Ver estado de servicios
```bash
sudo systemctl status linkholder
sudo systemctl status nginx
```

### Ver logs
```bash
# Logs de Django/Gunicorn
sudo journalctl -u linkholder -f
sudo tail -f /var/log/gunicorn/linkholder_error.log

# Logs de Nginx
sudo tail -f /var/log/nginx/linkholder_error.log
sudo tail -f /var/log/nginx/linkholder_access.log
```

### Reiniciar servicios
```bash
sudo systemctl restart linkholder
sudo systemctl restart nginx
```

### Gestión de Django
```bash
cd /var/www/linkholder/backend
source ../venv/bin/activate

# Crear superusuario
python manage.py createsuperuser

# Shell de Django
python manage.py shell

# Ver migraciones pendientes
python manage.py showmigrations
```

---

## 🔒 Configuración de Seguridad

### Variables de entorno (.env)

```env
DEBUG=False
SECRET_KEY=tu-clave-secreta-muy-larga-generada
ALLOWED_HOSTS=link.urarara.online,38.250.161.165,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://link.urarara.online
```

### Renovar certificado SSL

Los certificados de Let's Encrypt se renuevan automáticamente. Para forzar renovación:

```bash
sudo certbot renew --dry-run  # Prueba
sudo certbot renew            # Renovar
```

---

## 🐛 Solución de Problemas

### Error 502 Bad Gateway
- Verificar que Gunicorn esté corriendo: `sudo systemctl status linkholder`
- Ver logs: `sudo journalctl -u linkholder -n 50`

### Archivos estáticos no se cargan
```bash
cd /var/www/linkholder/backend
source ../venv/bin/activate
python manage.py collectstatic --no-input
sudo systemctl restart nginx
```

### Error de permisos
```bash
sudo chown -R www-data:www-data /var/www/linkholder
sudo chmod -R 755 /var/www/linkholder
```

### CORS errors
- Verificar `CORS_ALLOWED_ORIGINS` en `.env`
- Debe incluir `https://link.urarara.online`

---

## 📁 Estructura de Archivos en el Servidor

```
/var/www/linkholder/
├── backend/
│   ├── .env                 # Variables de entorno
│   ├── manage.py
│   ├── db.sqlite3
│   ├── staticfiles/         # Archivos estáticos (collectstatic)
│   └── media/               # Archivos subidos
├── frontend/
│   └── dist/                # Build de producción
├── venv/                    # Entorno virtual Python
├── deploy/
│   ├── nginx.conf
│   ├── gunicorn.service
│   ├── deploy.sh
│   └── update.sh
└── requirements.txt

/etc/nginx/sites-available/linkholder    # Configuración Nginx
/etc/systemd/system/linkholder.service   # Servicio Gunicorn
/var/log/gunicorn/                       # Logs de Gunicorn
/var/log/nginx/                          # Logs de Nginx
```

---

## ✅ Checklist de Despliegue

- [ ] DNS configurado (link.urarara.online → 38.250.161.165)
- [ ] Repositorio clonado en el VPS
- [ ] SECRET_KEY configurada en .env
- [ ] Migraciones ejecutadas
- [ ] Archivos estáticos recolectados
- [ ] Frontend compilado
- [ ] Gunicorn funcionando
- [ ] Nginx configurado
- [ ] Certificado SSL instalado
- [ ] Firewall configurado
- [ ] Superusuario creado
