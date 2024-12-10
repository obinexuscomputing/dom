#!/bin/bash

# Function to convert a filename to proper class name
# e.g., html-parser.ts -> HTMLParser
filename_to_classname() {
    local filename=$1
    # Remove .ts extension and convert to PascalCase
    echo "$filename" | sed -E 's/\.ts$//' | # Remove .ts extension
        sed -E 's/(^|-)([a-z])/\U\2/g'     # Convert to PascalCase
}

# Process TypeScript files
find src -type f -name "*.ts" -exec sh -c '
    for file; do
        # Get base filename without path
        basename=$(basename "$file" .ts)
        
        # Convert filename to proper class name
        classname=$(echo "$basename" | sed -E "s/(^|-)([a-z])/\U\2/g")
        
        # Special cases for common acronyms
        classname=$(echo "$classname" | sed "s/Html/HTML/g" | sed "s/Css/CSS/g" | sed "s/Ast/AST/g" | sed "s/Ppi/PPI/g")
        
        # Search and replace class definitions
        if grep -q "class.*{" "$file"; then
            sed -i "s/class [a-zA-Z0-9]*{/class $classname {/g" "$file"
            sed -i "s/class [a-zA-Z0-9]* {/class $classname {/g" "$file"
            echo "Updated class name in $file to $classname"
        fi
        
        # Search and replace export class definitions
        if grep -q "export class.*{" "$file"; then
            sed -i "s/export class [a-zA-Z0-9]*{/export class $classname {/g" "$file"
            sed -i "s/export class [a-zA-Z0-9]* {/export class $classname {/g" "$file"
            echo "Updated export class name in $file to $classname"
        fi
    done
' sh {} +

echo "Class renaming complete!"