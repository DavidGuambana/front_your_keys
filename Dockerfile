# Utilizar la imagen oficial de Nginx
FROM nginx:latest

# Copiar la configuración personalizada de Nginx
COPY nginx/conf/nginx.conf /etc/nginx/conf.d/nginx.conf

# Copiar todos los archivos del sitio web (HTML, CSS, JS, etc.) al directorio por defecto de Nginx
COPY front_your_keys/ /usr/share/nginx/html/

# Exponer el puerto 81 del contenedor
EXPOSE 81