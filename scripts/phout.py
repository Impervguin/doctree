import pandas as pd
import numpy as np
from datetime import datetime
import sys
import os

def analyze_phout_advanced(file_path):
    """Расширенный анализ phout файла"""
    
    columns = [
        'timestamp', 'tag', 'latency', 'connect', 'send', 'receive', 
        'interval_event', 'epoch_event', 'unknown1', 'unknown2', 'unknown3', 'status_code'
    ]
    
    df = pd.read_csv(file_path, sep='\t', header=None, names=columns)
    
    df['datetime'] = pd.to_datetime(df['timestamp'], unit='s')
    df['time_elapsed'] = df['timestamp'] - df['timestamp'].min()
    
    df['second'] = df['timestamp'].astype(int)
    rps_by_second = df.groupby('second').size()
    
    stats = {
        'total_requests': len(df),
        'duration': df['timestamp'].max() - df['timestamp'].min(),
        'success_rate': (len(df[df['status_code'] == 200]) / len(df)) * 100,
        'avg_rps': len(df) / (df['timestamp'].max() - df['timestamp'].min()),
        'max_rps': rps_by_second.max(),
        'min_rps': rps_by_second.min(),
        'latency_stats': {
            'mean': df['latency'].mean(),
            'std': df['latency'].std(),
            'min': df['latency'].min(),
            'max': df['latency'].max(),
            'p50': df['latency'].quantile(0.50),
            'p75': df['latency'].quantile(0.75),
            'p90': df['latency'].quantile(0.90),
            'p95': df['latency'].quantile(0.95),
            'p99': df['latency'].quantile(0.99)
        },
        'status_codes': df['status_code'].value_counts().to_dict(),
        'error_ratio': (len(df[df['status_code'] >= 400]) / len(df)) * 100
    }
    
    return stats, df

def generate_advanced_report(stats, df, output_file=None):
    """Генерация расширенного markdown отчёта"""
    
    report = f"""# 📊 Расширенный отчёт нагрузочного тестирования

## 📈 Обзор производительности

| Метрика | Значение |
|---------|----------|
| **Общее время тестирования** | {stats['duration']:.2f} сек |
| **Всего запросов** | {stats['total_requests']:,} |
| **Успешных запросов** | {stats['success_rate']:.2f}% |
| **Средний RPS** | {stats['avg_rps']:.2f} |
| **Пиковый RPS** | {stats['max_rps']:.0f} |
| **Минимальный RPS** | {stats['min_rps']:.0f} |
| **Процент ошибок** | {stats['error_ratio']:.2f}% |

## ⏱️ Статистика времени ответа (latency)

| Перцентиль | Время (нс) |
|------------|------------|
| **Среднее** | {stats['latency_stats']['mean']:.2f} |
| **Медиана (p50)** | {stats['latency_stats']['p50']:.2f} |
| **p75** | {stats['latency_stats']['p75']:.2f} |
| **p90** | {stats['latency_stats']['p90']:.2f} |
| **p95** | {stats['latency_stats']['p95']:.2f} |
| **p99** | {stats['latency_stats']['p99']:.2f} |
| **Максимум** | {stats['latency_stats']['max']:.2f} |
| **Стандартное отклонение** | {stats['latency_stats']['std']:.2f} |

## 🔢 Распределение HTTP статус кодов

| Статус код | Количество | Процент |
|------------|------------|---------|
"""

    for status, count in sorted(stats['status_codes'].items()):
        percentage = (count / stats['total_requests']) * 100
        report += f"| {status} | {count:,} | {percentage:.2f}% |\n"

    if output_file:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"Расширенный отчёт сохранён в: {output_file}")
    
    return report

def main():
    if len(sys.argv) < 2:
        print("Использование: python phout.py <path_to_phout_file> [output_report.md]")
        sys.exit(1)
    
    file_path = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "phout_report.md"
    
    stats, df = analyze_phout_advanced(file_path)
    report = generate_advanced_report(stats, df, output_file)
    
    print("🎯 Отчёт успешно сгенерирован!")
    print(f"📊 Основные метрики: {stats['total_requests']:,} запросов, {stats['success_rate']:.1f}% успешных, p95: {stats['latency_stats']['p95']:.0f}ms")

if __name__ == "__main__":
    main()