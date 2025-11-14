@echo off
echo Limpando cache do Next.js...
if exist .next rmdir /s /q .next
echo Cache limpo! Agora execute: npm run dev

