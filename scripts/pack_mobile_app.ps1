# Script đóng gói ứng dụng AURUM thành file ZIP
param (
    [string]$SourceDir = "dist",
    [string]$OutputFile = "aurum-app-mobile.zip"
)

if (Test-Path $SourceDir) {
    if (Test-Path $OutputFile) {
        Remove-Item $OutputFile -Force
    }
    Compress-Archive -Path "$SourceDir\*" -DestinationPath $OutputFile -Force
    Write-Host "Đã nén thành công file: $OutputFile"
} else {
    Write-Host "Không tìm thấy thư mục: $SourceDir"
}
