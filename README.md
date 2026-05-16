# Writebook

### Instantly publish your own books on the web for free, no publisher required.

Writebook is an easy-to-use application for publishing content on the web.
Content is authored in Markdown, and books can contain picture pages, chapters, and title pages.
Books can be published privately or publicly, and are searchable.

## How to get Writebook

Writebook is distributed as a Docker image.
The simplest way to install and run it is by using [ONCE](https://github.com/basecamp/once).

To get started, paste this snippet into a terminal on the machine where you want to install Writebook:

```sh
curl https://get.once.com/writebook | sh
```

## Deploying manually with Docker

If you'd rather set the Docker image up yourself, you can use `docker run` or `docker compose` to do that.
The official image is `ghcr.io/basecamp/writebook`.

You'll need to route the incoming web traffic to ports 80 and 443 (or just 80 if you run without SSL).
To persist the storage of the application, mount a Docker volume to `/rails/storage`.

You can configure the SSL setting with the following environment variables:

- `SSL_DOMAIN` - enable automatic SSL via Let's Encrypt for the given domain name
- `DISABLE_SSL` - alternatively, set `DISABLE_SSL` to serve over plain HTTP

## Running in development

Install dependencies:

```sh
bin/setup
```

Start the development server:

```sh
bin/dev
```

## Content Protection

This fork includes basic anti-copy measures to increase friction for casual copying:

- **Text selection disabled** on reading pages (inputs, textareas, and editors are excluded)
- **Copy/cut/context menu blocked** on reading pages
- **Dynamic watermark** showing user email, timestamp, and partial IP overlaid on reading pages
- **Print blocked** via CSS

These protections apply only to authenticated users viewing books/pages. Admin and editing interfaces are unaffected.

> Note: These measures deter casual copying but cannot prevent determined users or screenshots.
