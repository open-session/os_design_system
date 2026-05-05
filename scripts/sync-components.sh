#!/bin/bash
#
# Manual sync script for components from BOS-3.0
#
# Usage:
#   ./scripts/sync-components.sh [path-to-bos-3.0]
#
# If path is not provided, assumes ../BOS-3.0 relative to repo root.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory and repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Source path (default or provided)
BOS_PATH="${1:-$REPO_ROOT/../BOS-3.0}"

# Destination
DEST="$REPO_ROOT/tokens/components"

echo -e "${YELLOW}Component Sync${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Source: $BOS_PATH/components"
echo "Destination: $DEST"
echo ""

# Verify source exists
if [ ! -d "$BOS_PATH/components" ]; then
    echo -e "${RED}Error: BOS-3.0 components not found at $BOS_PATH/components${NC}"
    echo "Provide path as argument: ./scripts/sync-components.sh /path/to/BOS-3.0"
    exit 1
fi

# Get source commit info
if [ -d "$BOS_PATH/.git" ]; then
    SOURCE_SHA=$(cd "$BOS_PATH" && git rev-parse --short HEAD)
    SOURCE_MSG=$(cd "$BOS_PATH" && git log -1 --pretty=%s)
    echo "Source commit: $SOURCE_SHA - $SOURCE_MSG"
    echo ""
fi

# Confirm
read -p "Proceed with sync? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "Syncing..."

# Remove existing (preserve examples/)
rm -rf "$DEST/base"
rm -rf "$DEST/custom"
rm -rf "$DEST/ds"

# Copy fresh
cp -R "$BOS_PATH/components/base" "$DEST/"
cp -R "$BOS_PATH/components/custom" "$DEST/"
cp -R "$BOS_PATH/components/ds" "$DEST/"
cp "$BOS_PATH/components/README.md" "$DEST/"

# Count files
BASE_COUNT=$(find "$DEST/base" -type f | wc -l | tr -d ' ')
CUSTOM_COUNT=$(find "$DEST/custom" -type f | wc -l | tr -d ' ')
DS_COUNT=$(find "$DEST/ds" -type f | wc -l | tr -d ' ')
TOTAL=$((BASE_COUNT + CUSTOM_COUNT + DS_COUNT))

echo ""
echo -e "${GREEN}✓ Sync complete${NC}"
echo "  base/: $BASE_COUNT files"
echo "  custom/: $CUSTOM_COUNT files"
echo "  ds/: $DS_COUNT files"
echo "  Total: $TOTAL files"
echo ""

# Offer to commit
read -p "Stage and commit changes? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$REPO_ROOT"
    git add tokens/components/

    if [ -n "$SOURCE_SHA" ]; then
        git commit -m "chore(sync): update components from BOS-3.0 @ $SOURCE_SHA" \
            -m "Source: $SOURCE_MSG" \
            -m "" \
            -m "Manual sync via scripts/sync-components.sh"
    else
        git commit -m "chore(sync): update components from BOS-3.0" \
            -m "Manual sync via scripts/sync-components.sh"
    fi

    echo -e "${GREEN}✓ Committed${NC}"
fi

echo ""
echo "Done."
