#!/bin/bash

# Git Bulk Commit Script with Backdated Timestamps
# Usage: ./bulk-commit-template.sh <start_date> <commits_per_day> <time1> <time2> ...
# Example: ./bulk-commit-template.sh "2024-11-09" 2 "10:00:00" "18:00:00"

START_DATE="${1:-2024-11-09}"
COMMITS_PER_DAY="${2:-2}"
TIMES=("${@:3}")

# Default times if not provided
if [ ${#TIMES[@]} -eq 0 ]; then
  TIMES=("10:00:00" "18:00:00")
fi

# Validate inputs
if [ ! -f "/tmp/all_files.txt" ]; then
  echo "Error: /tmp/all_files.txt not found"
  echo "Generate it first with:"
  echo "git status --porcelain | grep '^??' | awk '{print \$2}' | while read f; do if [ -d \"\$f\" ]; then find \"\$f\" -type f; else echo \"\$f\"; fi; done | sort > /tmp/all_files.txt"
  exit 1
fi

files=()
while IFS= read -r line; do
  files+=("$line")
done < /tmp/all_files.txt

current_date=$(date -j -f "%Y-%m-%d" "$START_DATE" +%s)
file_index=0
total_files=${#files[@]}

echo "Starting bulk commits..."
echo "Total files: $total_files"
echo "Start date: $START_DATE"
echo "Commits per day: $COMMITS_PER_DAY"
echo "Times: ${TIMES[@]}"
echo ""

while [ $file_index -lt $total_files ]; do
  for ((i=0; i<COMMITS_PER_DAY; i++)); do
    if [ $file_index -ge $total_files ]; then
      break
    fi
    
    file="${files[$file_index]}"
    time_idx=$((i % ${#TIMES[@]}))
    time="${TIMES[$time_idx]}"
    
    date_str=$(date -j -f "%s" "$current_date" +%Y-%m-%d)
    timestamp="${date_str}T${time}"
    
    filename=$(basename "$file")
    
    git add "$file"
    git commit -m "Add $filename" > /dev/null 2>&1
    
    GIT_AUTHOR_DATE="$timestamp" GIT_COMMITTER_DATE="$timestamp" git commit --amend --no-edit --date="$timestamp" > /dev/null 2>&1
    
    echo "✓ Commit $((file_index + 1))/$total_files: $file [$timestamp]"
    
    file_index=$((file_index + 1))
  done
  
  current_date=$((current_date + 86400))
done

echo ""
echo "✓ All $total_files commits completed!"
git log --oneline | head -5

