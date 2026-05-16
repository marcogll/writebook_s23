# Writebook S23

### Fork de Writebook con protección de contenido integrada.

Writebook is an easy-to-use application for publishing content on the web.
Content is authored in Markdown, and books can contain picture pages, chapters, and title pages.
Books can be published privately or publicly, and are searchable.

Este fork agrega **protección básica contra copia** para aumentar la fricción en entornos corporativos.

## Protección de Contenido

Las siguientes medidas se aplican automáticamente en páginas de lectura para usuarios autenticados:

- **Selección de texto deshabilitada** globalmente (excluye inputs, textareas y editores)
- **Copy/cut/click derecho bloqueados** vía JavaScript
- **Watermark dinámico** con email del usuario, timestamp e IP parcial superpuesto en el contenido
- **Impresión bloqueada** via CSS `@media print`

> Estas medidas disuaden la copia casual pero no previenen screenshots o usuarios técnicos.

## Despliegue con Docker Compose

### Requisitos

- Docker y Docker Compose instalados
- Un dominio o acceso local

### Quick start

1. Clona este repositorio:

```sh
git clone https://github.com/marcogll/writebook_s23.git
cd writebook_s23
```

2. Copia y configura el archivo de entorno:

```sh
cp .env.example .env
```

3. Inicia los servicios:

```sh
docker compose up -d
```

4. Accede a `http://localhost:3000`

### Docker Compose

```yaml
services:
  writebook:
    image: marcogll/writebook_s23:latest
    ports:
      - "${PORT:-3000}:80"
    volumes:
      - writebook_storage:/rails/storage
    env_file:
      - .env
    restart: unless-stopped

volumes:
  writebook_storage:
```

### Variables de entorno (.env)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DISABLE_SSL` | Sirve sin SSL | `true` |
| `SSL_DOMAIN` | Dominio con SSL automático | `docs.miempresa.com` |
| `RAILS_MAX_THREADS` | Hilos de Rails | `5` |
| `PORT` | Puerto del host | `3000` |

## Despliegue en Coolify

1. Conecta el repositorio `marcogll/writebook_s23`
2. Selecciona **Docker Compose** como tipo de despliegue
3. Usa el `docker-compose.yml` incluido
4. Configura las variables de entorno en la UI de Coolify
5. Deploy

## Despliegue manual con Docker

Si prefieres configurar la imagen manualmente:

```sh
docker run -d \
  --name writebook \
  -p 3000:80 \
  -v writebook_data:/rails/storage \
  -e DISABLE_SSL=true \
  marcogll/writebook_s23:latest
```

## Cómo obtener Writebook original

Writebook original es distribuido como imagen Docker por Basecamp.
La forma más simple de instalarlo es usando [ONCE](https://github.com/basecamp/once):

```sh
curl https://get.once.com/writebook | sh
```

## Desarrollo local

Instala dependencias:

```sh
bin/setup
```

Inicia el servidor de desarrollo:

```sh
bin/dev
```

## Build de la imagen Docker

```sh
docker build -t marcogll/writebook_s23:latest .
docker push marcogll/writebook_s23:latest
```
