# Однократная публикация на GitHub (после: gh auth login)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Error "Установите GitHub CLI: winget install GitHub.cli"
}

gh auth status | Out-Null

$repoName = "sdr-lab"
if (git remote get-url origin 2>$null) {
  Write-Host "Remote origin уже настроен. Пушим main..."
  git push -u origin main
} else {
  gh repo create $repoName --public --source=. --remote=origin --push
}

Write-Host ""
Write-Host "Включите GitHub Pages: Settings -> Pages -> Source: GitHub Actions"
Write-Host "После workflow сайт будет на https://<ваш-login>.github.io/$repoName/"
