# EchoTrust

EchoTrust is a testimonial collection platform that aggregates reviews from social media and feedback forms into a wall of trust for your brand.

## Included Files

- **Dockerfile**: Containerizes the Next.js application.
- **docker-compose.yml**: Runs Prometheus in a Docker container.
- **prometheus-config.yml**: Prometheus configuration to scrape metrics from the application.

## Quick Start

1. Clone the repository.
2. Create a `.env` file in the root (see `.env.example` for required variables).
3. Build and run all services with Docker Compose:

   ```bash
   docker-compose up --build -d
