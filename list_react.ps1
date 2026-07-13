# List all React files in the umbrc folder
$outPath = "C:\Users\PC\Desktop\umbrc\react_files.txt"
Get-ChildItem -Path "C:\Users\PC\Desktop\umbrc" -Recurse -Include "*.js","*.jsx","*.ts","*.tsx","*.json","*.css","*.html" |
    Select-Object FullName, Length |
    Out-File -FilePath $outPath -Encoding UTF8
Write-Host "Done: $outPath"
