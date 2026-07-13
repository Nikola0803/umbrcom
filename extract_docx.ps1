# Extract docx content
$docxPath = "C:\Users\PC\AppData\Roaming\Claude\local-agent-mode-sessions\711134a4-2887-4ee8-a9cd-39b85825bd0c\1b728fdb-a739-4c8d-b699-6ebfe6dad5e5\local_80adf3c0-b2b6-4112-ab70-e9589c7acf7b\uploads\nicola_fixed.docx"
$outPath = "C:\Users\PC\Desktop\umbrc\docx_content.txt"

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.Entries | Where-Object { $_.FullName -eq "word/document.xml" }
$reader = New-Object System.IO.StreamReader($entry.Open())
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

# Strip XML tags to get plain text
$text = $xml -replace '<[^>]+>', ' '
$text = $text -replace '\s+', ' '
$text | Out-File -FilePath $outPath -Encoding UTF8
Write-Host "Done: $outPath"
