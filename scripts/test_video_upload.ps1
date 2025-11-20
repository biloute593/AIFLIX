# Test d'upload d'une vraie vidéo
$base = 'https://aiflix-d7fvy7d8t-biloutes-593.vercel.app'
$videoPath = "c:\Users\lydie\Videos\AIFLIX\test-video-2mb.mp4"

Write-Host "=== TEST UPLOAD VIDEO REELLE ===" -ForegroundColor Yellow

# 1. Création utilisateur
$username = "VIDEO_TEST_" + (Get-Random -Maximum 999999)
$password = "TestPass123!"
$email = "${username}@test.com"

Write-Host "`nCréation utilisateur: $username"
$registerBody = @{
    username = $username
    password = $password
    email = $email
} | ConvertTo-Json

$registerResp = Invoke-RestMethod -Uri "$base/api/register" -Method POST -Body $registerBody -ContentType "application/json"
Write-Host "Utilisateur créé" -ForegroundColor Green

# 2. Login
Write-Host "`nLogin..."
$loginBody = @{
    username = $username
    password = $password
} | ConvertTo-Json

$loginResp = Invoke-RestMethod -Uri "$base/api/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResp.token
Write-Host "Token obtenu" -ForegroundColor Green

# 3. Lecture et encodage de la vidéo
Write-Host "`nLecture du fichier vidéo..."
$videoBytes = [System.IO.File]::ReadAllBytes($videoPath)
$videoSize = $videoBytes.Length
$videoBase64 = [Convert]::ToBase64String($videoBytes)

Write-Host "Fichier lu: $($videoSize) bytes ($([Math]::Round($videoSize/1024/1024, 2)) MB)" -ForegroundColor Cyan

# 4. Upload
Write-Host "`nUpload de la vidéo..."
$uploadBody = @{
    title = "Test Video Upload"
    description = "Vidéo de test 2MB"
    type = "video/mp4"
    fileName = "test-video-2mb.mp4"
    fileType = "video/mp4"
    fileBase64 = $videoBase64
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "X-Debug" = "true"
}

try {
    $uploadResp = Invoke-RestMethod -Uri "$base/api/upload" -Method POST -Body $uploadBody -Headers $headers
    Write-Host "UPLOAD REUSSI!" -ForegroundColor Green
    Write-Host "Content ID: $($uploadResp.contentId)"
    
    # Vérification dans Azure
    Write-Host "`nVérification du blob dans Azure Storage..."
    Write-Host "Pour vérifier, exécutez:"
    Write-Host "az storage blob list --account-name stywuuywn7ytpkw --container-name videos --output table" -ForegroundColor Cyan
        
} catch {
    Write-Host "ERREUR UPLOAD:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host "Détails: $($_.ErrorDetails.Message)"
    }
}

Write-Host "`n=== FIN DU TEST ===" -ForegroundColor Yellow
