#!/bin/sh
# PreToolUse hook for the Bash tool. Reads the tool-call JSON on stdin and
# denies a short, conservative list of obviously destructive commands.
# POSIX sh + grep only, no other dependencies. Anything not matched is
# allowed silently (exit 0, no output).

INPUT=$(cat)

deny() {
  reason="$1"
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"%s"}}\n' "$reason"
  exit 0
}

# Only ever act on Bash tool calls (the hook is also scoped via the matcher
# in settings.json; this is a belt-and-suspenders check).
printf '%s' "$INPUT" | grep -Eq '"tool_name"[[:space:]]*:[[:space:]]*"Bash"' || exit 0

# 1) rm with a recursive+force flag (any letter order: -rf/-fr/-vrf/-Rf/...)
#    targeting /, ~, or a wildcard -- wipes everything.
if printf '%s' "$INPUT" | grep -Eq 'rm[[:space:]]+-[a-zA-Z]*([rR][a-zA-Z]*f|f[a-zA-Z]*[rR])[a-zA-Z]*[[:space:]]' \
  && printf '%s' "$INPUT" | grep -Eq 'rm[[:space:]].*[[:space:]]"?(/\*|~/\*|~|/|\*)("|[[:space:]]|$)'; then
  deny "This looks like it deletes everything on / , your home folder, or a whole folder via a wildcard. Blocked for safety -- please check with a developer before running this manually."
fi

# 2) git push --force (or -f) explicitly aimed at main/master.
if printf '%s' "$INPUT" | grep -Eq 'git[[:space:]]+push' \
  && printf '%s' "$INPUT" | grep -Eq -- '(--force|-f)([[:space:]"]|$)' \
  && printf '%s' "$INPUT" | grep -Eq '(main|master)'; then
  deny "This looks like a force-push to the main/master branch, which can permanently overwrite other people's work. Blocked for safety."
fi

# 3) chmod -R 777 -- makes everything world readable/writable/executable.
if printf '%s' "$INPUT" | grep -Eq 'chmod' \
  && printf '%s' "$INPUT" | grep -Eq -- '(-R|--recursive)' \
  && printf '%s' "$INPUT" | grep -Eq '777'; then
  deny "This looks like it makes every file open to anyone to read, change, or run (chmod -R 777). Blocked for safety."
fi

# 4) Piping a download straight into a shell -- runs unreviewed code.
if printf '%s' "$INPUT" | grep -Eq '(curl|wget)[^|]*\|[[:space:]]*(sudo[[:space:]]+)?(bash|sh|zsh)([[:space:]"]|$)'; then
  deny "This looks like it downloads a script and runs it immediately, without anyone reviewing it first. Blocked for safety -- download it, take a look, then run it separately."
fi

# 5) Reading a real .env file (allows .env.example/.sample/.template/.dist).
if printf '%s' "$INPUT" | grep -Eq '(cat|less|more|head|tail|vim|vi|nano|pico|bat)[[:space:]]+[^|;&]*\.env([[:space:]"]|$)' \
  && ! printf '%s' "$INPUT" | grep -Eq '\.env\.(example|sample|template|dist)'; then
  deny "This looks like it prints the contents of a .env file, which usually holds passwords or API keys. Blocked for safety -- ask a developer if you need to check a value."
fi

exit 0
