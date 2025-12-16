Документ о ходе работы: "Мосстройинформ".

1. Архитектура системы.
1.1 Компоненты.
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend UI   │────▶│  Backend API    │────▶│   Database      │
│   (React/Vue)   │◀────│  (Spring Boot)  │◀────│   (PostgreSQL)  │
│   :3000         │     │   :8080         │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   WebSocket     │     │   File Storage  │
│   Chat Server   │     │   (uploads/)    │
│   (Node.js)     │     │                 │
│   :3001         │     │                 │
└─────────────────┘     └─────────────────┘

1.2 Технологический стек.

Backend: Java 17, Spring Boot 3, Spring Security, Spring Data JPA
Frontend: React/Vue, Bootstrap
База данных: PostgreSQL (prod), H2 (dev)
Чат: Node.js, Socket.IO 4.8
Контейнеризация: Docker

2. Прогресс по этапам.
Этап 1: Выбор проекта

Реализовано:
- Модель Blueprint с 9 предзагруженными проектами
- API эндпоинты для получения проектов
- Создание пользовательского проекта
- Тестовые данные в DataInitializer

Артефакты:
- Blueprint.java - модель типового проекта
- BlueprintController.java - API контроллер
- ProjectController.java - управление проектами
- Тестовые данные: 9 проектов домов

Этап 2: Согласование документации

Реализовано:
- Модель Document с системой статусов
- Загрузка файлов на сервер
- Автоматический workflow статусов
- Скачивание документов
- Интеграция с облачным хранилищем

- Артефакты:
- Document.java - модель документа
- DocumentService.java - сервис документооборота
- DocumentStatusScheduler.java - автоматизация статусов
- API для полного цикла работы с документами

Этап 3: Этап строительства

Реализовано:
- WebSocket сервер для чата (отдельный сервис)
- Поле streamUrls в модели Project
- Интеграция с видео-сервисом
- Сохранение истории чата

Артефакты:
- index.ts - WebSocket сервер на Node.js
- Project.java - поле streamUrls для видео
- Отдельный чат-сервер на порту 3001

Этап 4: Завершение

Реализовано:
- Статусы проекта (NEW, approval, pending, completed)
- Workflow завершения проекта
- Финальные документы для подписания
- Электронное подписание

Артефакты:
- Project.java - система статусов
- Необходимо доработать процесс завершения

3. API эндпоинты.

Аутентификация:
- POST /api/auth/login - вход (возвращает cookie fm_session)
- POST /api/auth/logout - выход
- POST /api/auth/register - регистрация (в разработке)

Проекты:
- GET /api/blueprints - список типовых проектов
- POST /api/projects/create - создать проект
- GET /api/projects - мои проекты
- GET /api/projects/{id} - детали проекта

Документы:
- POST /api/documents/upload - загрузить документ
- GET /api/documents/user - мои документы
- GET /api/documents/project/{id} - документы проекта
- GET /api/documents/{id} - скачать документ
- PUT /api/documents/{id}/status - изменить статус
- DELETE /api/documents/{id} - удалить документ

Пользователи:
- GET /api/users/self - мои данные
- GET /api/users/{id} - данные пользователя

WebSocket Chat:
- ws://localhost:3001/chat - подключение к чату
- События: join_room, send-message, receive-message
