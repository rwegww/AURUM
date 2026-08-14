Add-Type -AssemblyName System.Drawing

$sourcePath = "d:\CODE\AURUM\apps\mobile\assets\logo.png"
$resDir = "d:\CODE\AURUM\apps\mobile\android\app\src\main\res"

$densities = @(
    @{ Name = "mipmap-mdpi"; Size = 48 },
    @{ Name = "mipmap-hdpi"; Size = 72 },
    @{ Name = "mipmap-xhdpi"; Size = 96 },
    @{ Name = "mipmap-xxhdpi"; Size = 144 },
    @{ Name = "mipmap-xxxhdpi"; Size = 192 }
)

$sourceImg = [System.Drawing.Image]::FromFile($sourcePath)

foreach ($d in $densities) {
    $targetFolder = Join-Path $resDir $d.Name
    if (-not (Test-Path $targetFolder)) {
        New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null
    }

    $size = $d.Size
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $graph = [System.Drawing.Graphics]::FromImage($bmp)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Draw white rounded background
    $rect = New-Object System.Drawing.Rectangle 0, 0, $size, $size
    $graph.Clear([System.Drawing.Color]::White)
    $graph.DrawImage($sourceImg, $rect)

    # Save as png and webp replacements
    $pngPath = Join-Path $targetFolder "ic_launcher.png"
    $roundPngPath = Join-Path $targetFolder "ic_launcher_round.png"
    $fgPngPath = Join-Path $targetFolder "ic_launcher_foreground.png"

    $bmp.Save($pngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save($roundPngPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save($fgPngPath, [System.Drawing.Imaging.ImageFormat]::Png)

    # Replace webp files if present
    $webpPath = Join-Path $targetFolder "ic_launcher.webp"
    $roundWebpPath = Join-Path $targetFolder "ic_launcher_round.webp"
    if (Test-Path $webpPath) {
        $bmp.Save($webpPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    if (Test-Path $roundWebpPath) {
        $bmp.Save($roundWebpPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }

    $graph.Dispose()
    $bmp.Dispose()
    Write-Host "Generated icons for $targetFolder ($size x $size)"
}

$sourceImg.Dispose()
Write-Host "Android app icons generated successfully!"
