#!/bin/bash

echo ""
echo "🚀 Starting Brand OS..."
echo ""

# Install backend deps
echo "📦 Installing backend dependencies..."
cd backend && npm install --silent
cd ..

# Install frontend deps
echo "📦 Installing frontend dependencies..."
cd frontend && npm install --silent
cd ..

echo ""
echo "✅ Dependencies installed."
echo ""
echo "🔌 Starting backend on http://localhost:3001"
cd backend && npm start &
BACKEND_PID=$!

sleep 2

echo "🎨 Starting frontend on http://localhost:3000"
cd ../frontend && npm start &
FRONTEND_PID=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Brand OS is running!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  Press Ctrl+C to stop both servers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait and cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Stopped.'" EXIT
wait
