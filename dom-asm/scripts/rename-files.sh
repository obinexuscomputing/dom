#!/bin/bash

# Function to convert camelCase/PascalCase to kebab-case
to_kebab_case() {
    echo "$1" | sed -r 's/([a-z0-9])([A-Z])/\1-\L\2/g' | sed -r 's/([A-Z])([A-Z][a-z])/\1-\L\2/g' | tr '[:upper:]' '[:lower:]'
}

# Process all TypeScript files
find src -type f -name "*.ts" | while read -r file; do
    dir=$(dirname "$file")
    filename=$(basename "$file")
    filename_noext="${filename%.ts}"
    
    # Convert to kebab case while preserving special acronyms
    new_name=$(to_kebab_case "$filename_noext")
    new_name=$(echo "$new_name" | sed 's/h-t-m-l/html/g' | sed 's/c-s-s/css/g' | sed 's/a-s-t/ast/g' | sed 's/p-p-i/ppi/g')
    
    # Only add .ts extension if it's not already there
    new_path="$dir/${new_name}.ts"
    
    # Only rename if the new name is different
    if [ "$file" != "$new_path" ]; then
        git mv "$file" "$new_path" 2>/dev/null || mv "$file" "$new_path"
        echo "Renamed: $file -> $new_path"
    fi
done

echo "File renaming complete!"