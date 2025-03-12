echo deprecated
exit 1

dirs=$(find ./src/frontend \( -iname "*.ts" -o -iname "*.tsx" \) -and -not -ipath "*node_modules*" | xargs dirname | sort -u)
for dir in $dirs
do
    rm $dir/index.ts
    for file in $(find $dir -maxdepth 1 \( -iname "*.ts" -o -iname "*.tsx" \) -and -not -ipath "*node_modules*" | grep -v vite)
    do
        filename=$(basename $file | cut -d'.' -f1)
        echo "export * from \"./$filename\"" >> "$dir/index.ts"
    done
done
