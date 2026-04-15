$filename = 'barCode.js'
$base = $filename -replace '\.js', ''
$pascal = $base -replace '-([a-z])', { $_.Groups[1].Value.ToUpper() }
$capitalized = $pascal.Substring(0,1).ToUpper() + $pascal.Substring(1)
$className = $capitalized + 'Shader'

Write-Host "filename: $filename"
Write-Host "base: $base"
Write-Host "pascal: $pascal"
Write-Host "capitalized: $capitalized"
Write-Host "className: $className"

# The actual filenameToDisplayName logic
$displayName = $base -replace '-', ' '
$displayName = $displayName -replace '([A-Z])', ' $1'
$displayName = $displayName.Substring(0,1).ToUpper() + $displayName.Substring(1)
$displayName = $displayName.Trim()

Write-Host "displayName: $displayName"

# Also test glitch-cathedral
Write-Host ""
Write-Host "--- Testing glitch-cathedral.js ---"
$filename2 = 'glitch-cathedral.js'
$base2 = $filename2 -replace '\.js', ''
$pascal2 = $base2 -replace '-([a-z])', { $_.Groups[1].Value.ToUpper() }
$capitalized2 = $pascal2.Substring(0,1).ToUpper() + $pascal2.Substring(1)
$className2 = $capitalized2 + 'Shader'
Write-Host "filename: $filename2"
Write-Host "className: $className2"
