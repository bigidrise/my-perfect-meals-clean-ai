#!/bin/bash

set -e

COMMIT_MSG="${1:-Update}"

echo "🔍 PRE-PUSH VALIDATION STARTING..."
echo "=================================="
echo ""

echo "📋 Step 1/4: Checking TypeScript compilation..."
if npx tsc --noEmit; then
  echo "✅ TypeScript: No errors"
else
  echo "❌ FAILED: TypeScript errors detected"
  echo "Fix errors before pushing!"
  exit 1
fi
echo ""

echo "🔧 Step 2/4: Building production bundle..."
if npm run build > /dev/null 2>&1; then
  echo "✅ Build: Success"
else
  echo "❌ FAILED: Build errors detected"
  echo "Run 'npm run build' to see details"
  exit 1
fi
echo ""

echo "🚀 Step 3/4: Testing server startup..."
timeout 15s npm run dev > /tmp/server-test.log 2>&1 &
SERVER_PID=$!
sleep 8

if kill -0 $SERVER_PID 2>/dev/null; then
  echo "✅ Server: Started successfully"
  kill $SERVER_PID 2>/dev/null || true
else
  echo "❌ FAILED: Server crashed on startup"
  echo "Check logs at /tmp/server-test.log"
  exit 1
fi
echo ""

echo "📦 Step 4/4: Pushing to repository..."
./push.sh "$COMMIT_MSG"
echo ""

echo "=================================="
echo "✅ ALL CHECKS PASSED - PUSHED SUCCESSFULLY!"
echo "🚀 Safe to publish/deploy"
