#!/bin/bash

# Family Business - Docker Quick Start Script
# Этот скрипт упрощает работу с Docker

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

function print_error() {
    echo -e "${RED}✗ $1${NC}"
}

function print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

function check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker не установлен. Установите Docker: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker daemon не запущен. Запустите Docker Desktop."
        exit 1
    fi
    
    # Определяем какую версию docker compose использовать
    if docker compose version &> /dev/null; then
        DOCKER_COMPOSE="docker compose"
    elif command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
    else
        print_error "Docker Compose не установлен. Установите Docker Compose или обновите Docker Desktop."
        exit 1
    fi
    
    print_success "Docker установлен и работает"
}

function check_env() {
    if [ ! -f .env ]; then
        print_info "Создание .env файла из примера..."
        cp .env.docker.example .env
        print_success ".env файл создан. Отредактируйте его перед production использованием!"
    else
        print_success ".env файл существует"
    fi
}

function start_services() {
    print_info "Запуск сервисов..."
    $DOCKER_COMPOSE up -d
    print_success "Сервисы запущены!"
    
    echo ""
    print_info "Ожидание готовности сервисов..."
    sleep 5
    
    echo ""
    print_success "🚀 Family Business запущен!"
    echo ""
    echo "  📱 Backend API:        http://localhost:3000"
    echo "  📚 Swagger документация: http://localhost:3000/api-docs"
    echo "  🌐 Web приложение:     http://localhost:3001"
    echo ""
    print_info "Просмотр логов: docker-compose logs -f"
    print_info "Остановка:      docker-compose down"
}

function stop_services() {
    print_info "Остановка сервисов..."
    $DOCKER_COMPOSE down
    print_success "Сервисы остановлены"
}

function restart_services() {
    print_info "Перезапуск сервисов..."
    $DOCKER_COMPOSE restart
    print_success "Сервисы перезапущены"
}

function rebuild_services() {
    print_info "Пересборка и запуск сервисов..."
    $DOCKER_COMPOSE down
    $DOCKER_COMPOSE build --no-cache
    $DOCKER_COMPOSE up -d
    print_success "Сервисы пересобраны и запущены"
}

function show_logs() {
    $DOCKER_COMPOSE logs -f
}

function show_status() {
    echo ""
    print_info "Статус сервисов:"
    $DOCKER_COMPOSE ps
    echo ""
    
    if $DOCKER_COMPOSE ps | grep -q "Up"; then
        print_success "Сервисы работают"
        echo ""
        echo "  📱 Backend API:        http://localhost:3000"
        echo "  📚 Swagger документация: http://localhost:3000/api-docs"
        echo "  🌐 Web приложение:     http://localhost:3001"
    else
        print_error "Сервисы не запущены"
    fi
    echo ""
}

function clean_all() {
    print_info "Очистка всех контейнеров, образов и volumes..."
    read -p "Это удалит ВСЕ данные. Продолжить? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        $DOCKER_COMPOSE down -v
        docker system prune -a -f
        print_success "Очистка завершена"
    else
        print_info "Очистка отменена"
    fi
}

function backup_db() {
    print_info "Создание резервной копии базы данных..."
    timestamp=$(date +%Y%m%d_%H%M%S)
    docker cp family-business-backend:/app/apps/backend/prisma/data/prod.db "./backup_${timestamp}.db"
    print_success "Резервная копия создана: backup_${timestamp}.db"
}

function show_help() {
    echo "Family Business - Docker Management Script"
    echo ""
    echo "Использование: ./docker.sh [команда]"
    echo ""
    echo "Команды:"
    echo "  start      - Запустить все сервисы"
    echo "  stop       - Остановить все сервисы"
    echo "  restart    - Перезапустить все сервисы"
    echo "  rebuild    - Пересобрать и запустить сервисы"
    echo "  logs       - Показать логи (Ctrl+C для выхода)"
    echo "  status     - Показать статус сервисов"
    echo "  backup     - Создать резервную копию базы данных"
    echo "  clean      - Удалить все контейнеры и данные"
    echo "  help       - Показать эту справку"
    echo ""
}

# Main script
case "${1:-}" in
    start)
        check_docker
        check_env
        start_services
        ;;
    stop)
        check_docker
        stop_services
        ;;
    restart)
        check_docker
        restart_services
        ;;
    rebuild)
        check_docker
        rebuild_services
        ;;
    logs)
        check_docker
        show_logs
        ;;
    status)
        check_docker
        show_status
        ;;
    backup)
        check_docker
        backup_db
        ;;
    clean)
        check_docker
        clean_all
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        exit 1
        ;;
esac
