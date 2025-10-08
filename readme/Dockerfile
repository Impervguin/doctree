# context: ..
FROM python:3.13-slim

WORKDIR /app

COPY readme/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY readme/serv.py .
COPY readme.md .
COPY readme/images ./readme/images

EXPOSE 8000
CMD ["python", "serv.py"]