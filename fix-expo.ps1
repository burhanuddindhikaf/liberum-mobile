Write-Host "=== Perbaikan Path & Cache Expo / Metro ===" -ForegroundColor Cyan

# 1. Stop Metro/Expo server kalau ada
Write-Host ">> Menghentikan semua proses node / expo..."
Get-Process node, expo -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Hapus cache Metro
Write-Host ">> Menghapus cache Metro..."
$metroCache = "$env:LOCALAPPDATA\Temp\metro-cache"
if (Test-Path $metroCache) { Remove-Item $metroCache -Recurse -Force }

# 3. Hapus cache expo
Write-Host ">> Menghapus cache Expo..."
$expoCache = "$env:USERPROFILE\.expo"
if (Test-Path $expoCache) { Remove-Item $expoCache -Recurse -Force }

# 4. Hapus node_modules dan package-lock.json
Write-Host ">> Menghapus node_modules dan package-lock.json..."
if (Test-Path "node_modules") { Remove-Item node_modules -Recurse -Force }
if (Test-Path "package-lock.json") { Remove-Item package-lock.json -Force }

# 5. Reinstall Node.js versi yang dipakai
Write-Host ">> Reinstall Node.js 20.18.0 lewat fnm..."
fnm install 20.18.0 --reinstall
fnm use 20.18.0
fnm env --use-on-cd | Out-String | Invoke-Expression

# 6. Install dependencies project
Write-Host ">> Menginstall ulang dependencies..."
npm install

# 7. Pastikan expo & metro-runtime terinstall
Write-Host ">> Memastikan expo & metro-runtime terpasang..."
npm install expo metro-runtime

# 8. Jalankan ulang project dengan clear cache
Write-Host ">> Menjalankan ulang expo dengan reset cache..."
npx expo start -c
