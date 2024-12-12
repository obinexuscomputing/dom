find . -path './**/.git' -prune -o -type f -exec cat {} + > file.txt
