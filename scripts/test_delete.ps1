# Script de test pour DELETE /api/contents/[id]
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\test_delete.ps1

$base = 'https://aiflix-lhmyikgis-biloutes-593.vercel.app'

Write-Host "1) Création d'un utilisateur test"
$un = "AUTOTEST_DEL_" + (Get-Random -Maximum 999999)
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

# Générer un ObjectId MongoDB valide (24 hex chars)
function New-ObjectId {
    $bytes = New-Object Byte[] 12
    (New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
    return ($bytes | ForEach-Object { $_.ToString('x2') }) -join ''
}
$id = New-ObjectId
Write-Host "3) Tentative DELETE sur un id valide mais inexistant: $id"
try {
    $resp = Invoke-WebRequest -Uri "$base/api/contents/$id" -Method DELETE -Headers @{ Authorization = "Bearer $token" } -UseBasicParsing -ErrorAction Stop
    Write-Host "DELETE status:" $resp.StatusCode
    $content = $resp.Content
    Write-Host "Response:`n$content"
} catch {
    if ($_.Exception.Response) {
        $status = $_.Exception.Response.StatusCode.value__
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $text = $reader.ReadToEnd()
        Write-Host "DELETE -> status: $status`nBody:`n$text"
    } else {
        Write-Host "DELETE error ->" $_.Exception.Message
    }
}

Write-Host "Script terminé."