.PHONY: dev db backend frontend stop install

# Run everything: database, backend, frontend
dev: db backend frontend

# Start PostgreSQL in docker
db:
	docker compose up -d db
	@echo "Waiting for PostgreSQL to be ready..."
	@until docker compose exec db pg_isready -U postgres > /dev/null 2>&1; do sleep 1; done
	@echo "Database is ready"

# Start backend dev server
backend:
	cd backend && npm run dev &

# Start frontend dev server
frontend:
	cd frontend && npm run dev &

# Stop everything
stop:
	-kill $$(lsof -t -i:5000) 2>/dev/null || true
	-kill $$(lsof -t -i:3000) 2>/dev/null || true
	docker compose down

# Install dependencies for both
install:
	cd backend && npm install
	cd frontend && npm install

# Reset database (drops volume and re-creates)
db-reset:
	docker compose down -v
	docker compose up -d db
	@echo "Waiting for PostgreSQL to be ready..."
	@until docker compose exec db pg_isready -U postgres > /dev/null 2>&1; do sleep 1; done
	@echo "Database reset complete"
