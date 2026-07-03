#!/bin/sh
# SessionStart hook: reminds the user to onboard, or nudges toward GOALS.md.
# POSIX sh, coreutils only. Must work regardless of $PWD by anchoring on
# $CLAUDE_PROJECT_DIR (set by Claude Code) with a cwd fallback.

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
MARKER="$PROJECT_DIR/.claude/.onboarded"

if [ ! -f "$MARKER" ]; then
  cat <<'EOF'
This workspace hasn't been set up yet.

Say "onboard me" or run /onboard to start the setup wizard
(5 steps, about 15 minutes). It sets up your company info, goals,
and first workflow, and connects your email so every other
command actually knows your business.
EOF
else
  echo "Reminder: GOALS.md drives today's priorities -- check it before diving in."
fi

exit 0
