#!/bin/sh
# Fail open if Node isn't installed — the guard is best-effort, never a blocker.
command -v node >/dev/null 2>&1 || exit 0
exec node "${CLAUDE_PROJECT_DIR:-.}/.claude/hooks/injection-scanner.js"
