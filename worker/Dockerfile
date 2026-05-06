FROM python:3.11-alpine AS runtime
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN addgroup -S app && adduser -S app -G app
USER app
CMD ["python", "worker.py"]
