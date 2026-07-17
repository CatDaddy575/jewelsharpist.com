# Compress images in content/photos folder
$photoFolder = "$PSScriptRoot\content\photos"
$supportedTypes = @('.jpg', '.jpeg', '.jpe')

Get-ChildItem $photoFolder -File | Where-Object { $supportedTypes -contains $_.Extension.ToLower() } | ForEach-Object {
    $imagePath = $_.FullName
    $fileName = $_.Name

    try {
        [System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") | Out-Null

        $image = [System.Drawing.Image]::FromFile($imagePath)

        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
                   Where-Object { $_.MimeType -eq "image/jpeg" } |
                   Select-Object -First 1

        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 75)

        $image.Save($imagePath, $encoder, $encoderParams)
        $image.Dispose()

        $newSize = (Get-Item $imagePath).Length / 1MB
        Write-Host "[OK] Compressed: $fileName ($($newSize.ToString('F2')) MB)"
    }
    catch {
        Write-Host "[ERROR] Error compressing $fileName : $_"
    }
}

Write-Host "Compression complete!"