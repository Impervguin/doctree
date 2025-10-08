from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import markdown
import os
from pathlib import Path

app = FastAPI(title="Markdown File Server")

# Путь к markdown файлу
MARKDOWN_FILE_PATH = Path("readme.md")
IMAGES_DIR = Path("readme")

@app.get("/", response_class=HTMLResponse)
async def read_root():
    try:
        # Читаем markdown файл
        if MARKDOWN_FILE_PATH.exists():
            with open(MARKDOWN_FILE_PATH, "r", encoding="utf-8") as f:
                markdown_content = f.read()
        else:
            # Если файл не найден, используем fallback контент
            markdown_content = """
            # Файл не найден
            
            Файл `README.md` не найден в корневой директории.
            
            Создайте файл `README.md` с markdown содержимым.
            """
        
        # Преобразуем markdown в HTML
        html_content = markdown.markdown(
            markdown_content,
            extensions=['fenced_code', 'tables', 'toc', 'codehilite']
        )
        
        # HTML шаблон с стилями
        styled_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Документация</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github-dark.min.css">
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"></script>
            <script>hljs.highlightAll();</script>
            <style>
                body {{
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    line-height: 1.6;
                    color: #24292e;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f6f8fa;
                }}
                .markdown-body {{
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }}
                h1, h2, h3 {{
                    color: #2c3e50;
                }}
                h1 {{
                    border-bottom: 3px solid #3498db;
                    padding-bottom: 15px;
                }}
                img {{
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    margin: 10px 0;
                }}
                code {{
                    background-color: #f1f3f4;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace;
                    font-size: 0.9em;
                }}
                pre {{
                    background-color: #1e1e1e;
                    border-radius: 8px;
                    padding: 20px;
                    overflow-x: auto;
                }}
                blockquote {{
                    border-left: 5px solid #3498db;
                    padding: 10px 20px;
                    margin: 20px 0;
                    background-color: #ecf0f1;
                    border-radius: 0 8px 8px 0;
                }}
                table {{
                    border-collapse: collapse;
                    width: 100%;
                    margin: 20px 0;
                }}
                th, td {{
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }}
                th {{
                    background-color: #3498db;
                    color: white;
                }}
                tr:nth-child(even) {{
                    background-color: #f2f2f2;
                }}
            </style>
        </head>
        <body>
            <div class="markdown-body">
                {html_content}
            </div>
        </body>
        </html>
        """
        return HTMLResponse(content=styled_html)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при чтении файла: {str(e)}")

@app.get("/readme/{file_path:path}")
async def serve_image(file_path: str):
    safe_path = Path(file_path)
    if safe_path.is_absolute() or ".." in file_path:
        raise HTTPException(status_code=400, detail="Некорректный путь к файлу")
    file_full_path = IMAGES_DIR / safe_path
    
    # Проверяем существование файла
    if not file_full_path.exists():
        raise HTTPException(status_code=404, detail="Файл не найден")
    
    # Проверяем, что файл находится в разрешенной директории
    if not file_full_path.resolve().is_relative_to(IMAGES_DIR.resolve()):
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    
    media_type = "application/octet-stream"
    file_extension = file_full_path.suffix.lower()

    image_extensions = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.bmp': 'image/bmp',
        '.ico': 'image/x-icon'
    }
    
    media_type = image_extensions.get(file_extension, 'application/octet-stream')
    
    return FileResponse(
        path=file_full_path,
        media_type=media_type,
        filename=file_full_path.name
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)