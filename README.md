# Writebook S23

Fork of [Writebook](https://github.com/basecamp/writebook) with integrated content protection.

Writebook is an easy-to-use application for publishing content on the web. Content is authored in Markdown, and books can contain picture pages, chapters, and title pages. Books can be published privately or publicly, and are searchable.

## Content Protection

This fork adds basic anti-copy measures to increase friction in corporate environments. Protection is automatically enabled on all reading pages (both authenticated and public):

- **Text selection disabled** globally (excludes inputs, textareas, and editors)
- **Copy/cut/right-click blocked** via JavaScript
- **Dynamic watermark** with user email, timestamp, and partial IP overlaid on content
- **Print blocked** via CSS `@media print`

> These measures deter casual copying but do not prevent screenshots or technical users.

## Quick Start

### Docker Compose

1. Clone the repository:

```sh
git clone https://github.com/marcogll/writebook_s23.git
cd writebook_s23
```

2. Configure environment variables:

```sh
cp .env.example .env
```

3. Start the services:

```sh
docker compose up -d
```

4. Access at `http://localhost:3000`

### docker-compose.yml

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

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DISABLE_SSL` | Serve without SSL | `true` |
| `SSL_DOMAIN` | Domain for automatic SSL | `docs.example.com` |
| `RAILS_MAX_THREADS` | Rails thread count | `5` |
| `PORT` | Host port | `3000` |

## Deployment

### Coolify

1. Connect the repository `marcogll/writebook_s23`
2. Select **Docker Compose** as deployment type
3. Use the included `docker-compose.yml`
4. Configure environment variables in the Coolify UI
5. Deploy

### Manual Docker

```sh
docker run -d \
  --name writebook \
  -p 3000:80 \
  -v writebook_data:/rails/storage \
  -e DISABLE_SSL=true \
  marcogll/writebook_s23:latest
```

### Build the Docker Image

```sh
# For amd64 (most servers)
docker buildx build --platform linux/amd64 -t marcogll/writebook_s23:latest --push .

# For arm64 (Apple Silicon)
docker buildx build --platform linux/arm64 -t marcogll/writebook_s23:latest --push .
```

## Local Development

Install dependencies:

```sh
bin/setup
```

Start the development server:

```sh
bin/dev
```

Run tests:

```sh
bin/rails test
```

## Original Writebook

Writebook is distributed as a Docker image by Basecamp. The simplest way to install the original version is using [ONCE](https://github.com/basecamp/once):

```sh
curl https://get.once.com/writebook | sh
```

## License

This fork inherits the license of the original Writebook project.
