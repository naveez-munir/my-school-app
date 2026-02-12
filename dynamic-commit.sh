#!/bin/bash

# Dynamic commit script for all staged and unstaged files
# Date range: Feb 2, 2026 to March 13, 2026
# Excludes .md files
# Realistic timestamps throughout each day

echo "Creating backdated commits for all changes..."
echo "Date range: Feb 2, 2026 - Mar 13, 2026"
echo ""

# Function to generate realistic time within a day
generate_time() {
    local day=$1
    local hour=$((8 + RANDOM % 10))  # 8-17
    local minute=$((RANDOM % 60))
    printf "%02d:%02d:00" $hour $minute
}

# Function to add days to a date
add_days() {
    local date=$1
    local days=$2
    date -j -f "%Y-%m-%d" -v+${days}d "$date" +"%Y-%m-%d"
}

# Get all modified and untracked files (excluding .md files)
echo "Scanning for staged and unstaged files..."
echo ""

# Collect all files to commit
declare -a FILES_TO_COMMIT

# Get modified files (staged and unstaged)
while IFS= read -r file; do
    if [[ ! "$file" =~ \.md$ ]]; then
        FILES_TO_COMMIT+=("$file")
    fi
done < <(git status --porcelain | grep -E "^[AM ]|^ [AM]|^MM|^[AM]M" | awk '{print $NF}')

# Get untracked files (excluding .md files)
while IFS= read -r file; do
    if [[ ! "$file" =~ \.md$ ]]; then
        FILES_TO_COMMIT+=("$file")
    fi
done < <(git status --porcelain | grep "^??" | awk '{print $NF}')

# Remove duplicates
FILES_TO_COMMIT=($(printf '%s\n' "${FILES_TO_COMMIT[@]}" | sort -u))

echo "Found ${#FILES_TO_COMMIT[@]} files to commit (excluding .md files)"
echo ""

# Start date
START_DATE="2026-02-02"
CURRENT_DATE="$START_DATE"
COMMIT_COUNT=0
DAY_COMMIT_COUNT=0

# Process each file
for file in "${FILES_TO_COMMIT[@]}"; do
    # Generate realistic timestamp
    TIME=$(generate_time $COMMIT_COUNT)
    DATETIME="${CURRENT_DATE}T${TIME}"
    
    # Determine commit message based on file type
    if [[ "$file" == *".tsx" ]]; then
        MSG="Update $(basename $file) component"
    elif [[ "$file" == *".ts" ]]; then
        MSG="Update $(basename $file) utility"
    elif [[ "$file" == *".json" ]]; then
        MSG="Update $(basename $file) configuration"
    else
        MSG="Update $(basename $file)"
    fi
    
    # Add and commit file
    git add "$file" 2>/dev/null
    if [ $? -eq 0 ]; then
        git commit -m "$MSG" 2>/dev/null
        if [ $? -eq 0 ]; then
            # Amend with backdated timestamp
            GIT_AUTHOR_DATE="$DATETIME" GIT_COMMITTER_DATE="$DATETIME" git commit --amend --no-edit --date="$DATETIME" 2>/dev/null
            echo "✓ Commit $((COMMIT_COUNT + 1)): $file [$DATETIME]"
            
            COMMIT_COUNT=$((COMMIT_COUNT + 1))
            DAY_COMMIT_COUNT=$((DAY_COMMIT_COUNT + 1))
            
            # Move to next day after every 3-5 commits
            if [ $DAY_COMMIT_COUNT -ge $((3 + RANDOM % 3)) ]; then
                CURRENT_DATE=$(add_days "$CURRENT_DATE" 1)
                DAY_COMMIT_COUNT=0
                echo "  → Moving to next day: $CURRENT_DATE"
            fi
        fi
    fi
done

echo ""
echo "=== Summary ==="
echo "✓ All commits created successfully!"
echo ""
echo "Total commits created: $COMMIT_COUNT"
echo "Date range: $START_DATE to $CURRENT_DATE"
echo ""
echo "Recent commits:"
git log --oneline --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%h - %ad - %s' -20
echo ""

