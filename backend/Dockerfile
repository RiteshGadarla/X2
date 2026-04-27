FROM python:3.12.10-slim

# Install Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Nginx config - similar to frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

ENV APP_ENV=production
ENV BACKEND_PORT=8000
ENV BACKEND_HOST=127.0.0.1
ENV BACKEND_RELOAD=false

EXPOSE 5000

# Start Nginx and the Python app
CMD nginx && python main.py
