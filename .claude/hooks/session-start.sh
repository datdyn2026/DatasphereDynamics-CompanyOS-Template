#!/bin/sh
# SessionStart hook: reminds the user to onboard, or nudges toward GOALS.md.
# POSIX sh, coreutils only. Must work regardless of $PWD by anchoring on
# $CLAUDE_PROJECT_DIR (set by Claude Code) with a cwd fallback.

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
MARKER="$PROJECT_DIR/.claude/.onboarded"

if [ ! -f "$MARKER" ]; then
  cat <<'EOF'
This workspace hasn't been set up yet.

Say "onboard me" or run /onboard to answer a few quick questions
(about 15 minutes). That sets up your company info, goals, and
first workflow so every other command actually knows your business.
EOF
else
  echo "Reminder: GOALS.md drives today's priorities -- check it before diving in."
fi

exit 0
