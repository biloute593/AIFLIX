# Script de test pour POST /api/upload
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\test_upload.ps1

$base = 'https://aiflix-lhmyikgis-biloutes-593.vercel.app'

Write-Host "1) Création d'un utilisateur test"
$un = "AUTOTEST_UPL_" + (Get-Random -Maximum 999999)
$body = @{ name = $un; username = $un; password = 'Pass123!' } | ConvertTo-Json
try {
    $reg = Invoke-RestMethod -Uri "$base/api/register" -Method POST -ContentType 'application/json' -Body $body
    Write-Host "Register OK ->" ($reg | ConvertTo-Json)
} catch {
    Write-Host "Register failed ->" $_.Exception.Message
    Exit 1
}

Write-Host "2) Login du test user"
$loginBody = @{ username = $un; password = 'Pass123!' } | ConvertTo-Json
try {
    $login = Invoke-RestMethod -Uri "$base/api/login" -Method POST -ContentType 'application/json' -Body $loginBody
    $token = $login.token
    Write-Host "Login OK -> token present:" ($token -ne $null)
} catch {
    Write-Host "Login failed ->" $_.Exception.Message
    Exit 1
}

Write-Host "3) Test upload avec un petit fichier de test"
# Créer un petit fichier de test (texte encodé en base64)
$testContent = "Ceci est un fichier de test pour AIFLIX"
$testBytes = [System.Text.Encoding]::UTF8.GetBytes($testContent)
$testBase64 = [Convert]::ToBase64String($testBytes)

$uploadBody = @{
    title = "Test Upload"
    description = "Fichier de test automatique"
    type = "video"
    fileName = "test.txt"
    fileType = "text/plain"
    fileBase64 = $testBase64
} | ConvertTo-Json

try {
    $headers = @{
        'Authorization' = "Bearer $token"
        'Content-Type' = 'application/json'
        'X-Debug' = 'true'  # Active le mode debug
    }
    
    $resp = Invoke-WebRequest -Uri "$base/api/upload" -Method POST -Headers $headers -Body $uploadBody -UseBasicParsing -ErrorAction Stop
    Write-Host "UPLOAD status:" $resp.StatusCode
    $content = $resp.Content
    Write-Host "Response:`n$content"
} catch {
    if ($_.Exception.Response) {
        $status = $_.Exception.Response.StatusCode.value__
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $text = $reader.ReadToEnd()
        Write-Host "UPLOAD ERROR -> status: $status`nBody:`n$text"
    } else {
        Write-Host "UPLOAD error ->" $_.Exception.Message
    }
}

Write-Host "Script terminé."