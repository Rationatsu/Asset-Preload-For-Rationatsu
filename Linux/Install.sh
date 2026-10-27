#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
THEME_NAME="Designed-By-Rationatsu"
DEST="${XDG_DATA_HOME:-$HOME/.local/share}/icons/$THEME_NAME"
if ! command -v xcursorgen >/dev/null 2>&1; then
  echo "xcursorgen belum terpasang. Install dulu: sudo apt update && sudo apt install xcursor-themes"
  exit 2
fi
mkdir -p "$DEST/cursors"

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
for name in idle pointer text busy progress unavailable; do
  src="$ROOT/assets/$name.conf"
  : > "$TMP/$name.conf"
  while read -r size x y delay png; do
    [ -n "${png:-}" ] || continue
    printf '%s %s %s %s %s\n' "$size" "$x" "$y" "$delay" "$ROOT/assets/$(basename "$png")" >> "$TMP/$name.conf"
  done < "$src"
  xcursorgen "$TMP/$name.conf" "$DEST/cursors/$name"
done

cd "$DEST/cursors"
for pair in 'default idle' 'left_ptr idle' 'arrow idle' 'top_left_arrow idle' 'hand2 pointer' 'pointer pointer' 'hand1 pointer' 'text text' 'xterm text' 'wait busy' 'watch busy' 'progress progress' 'left_ptr_watch progress' 'not-allowed unavailable' 'crossed_circle unavailable' 'forbidden unavailable' 'no unavailable' 'help pointer' 'question_arrow pointer' 'link pointer' 'move pointer' 'fleur pointer' 'copy pointer' 'alias pointer' 'grab pointer' 'grabbing pointer' 'ew-resize pointer' 'ns-resize pointer' 'col-resize pointer' 'row-resize pointer' 'nwse-resize pointer' 'nesw-resize pointer' 'zoom-in pointer' 'zoom-out pointer'; do
  set -- $pair; ln -sf "$2" "$1"
done
cat > "$DEST/index.theme" <<EOF
[Icon Theme]
Name=Designed By Rationatsu
Comment=Hikaru animated cursor theme
Inherits=Adwaita
EOF

if command -v gsettings >/dev/null 2>&1 && gsettings list-schemas | grep -qx 'org.gnome.desktop.interface'; then
  gsettings set org.gnome.desktop.interface cursor-theme "$THEME_NAME" || true
fi
if command -v xfconf-query >/dev/null 2>&1; then
  xfconf-query -c xsettings -p /Gtk/CursorThemeName -s "$THEME_NAME" 2>/dev/null || true
fi
echo "Cursor theme installed to: $DEST"
echo "If it does not change immediately, log out/in or choose '$THEME_NAME' in your desktop cursor settings."
