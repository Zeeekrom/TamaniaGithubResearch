Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$LocalUrl = "http://127.0.0.1:8787/"
$RenderUrl = "https://tamaniagithubresearch.onrender.com/"
$script:LocalProcess = $null

function Get-NodePath {
    $bundled = "C:\Users\Reeshiram\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
    if (Test-Path $bundled) { return $bundled }
    $cmd = Get-Command node -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    return $null
}

function Get-NpmCommand {
    $cmd = Get-Command npm.cmd -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    return $null
}

function Stop-LocalServer {
    if ($script:LocalProcess -and -not $script:LocalProcess.HasExited) {
        try { Stop-Process -Id $script:LocalProcess.Id -Force -ErrorAction SilentlyContinue } catch {}
    }
    $script:LocalProcess = $null

    $pids = Get-NetTCPConnection -LocalPort 8787 -ErrorAction SilentlyContinue |
        Where-Object { $_.State -eq "Listen" } |
        Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pidValue in $pids) {
        try {
            $p = Get-Process -Id $pidValue -ErrorAction Stop
            if ($p.ProcessName -match "node|npm") {
                Stop-Process -Id $pidValue -Force -ErrorAction SilentlyContinue
            }
        } catch {}
    }
}

function Test-LocalServer {
    $conn = Get-NetTCPConnection -LocalPort 8787 -ErrorAction SilentlyContinue |
        Where-Object { $_.State -eq "Listen" }
    return [bool]$conn
}

function Set-Status {
    param([string]$Text, [string]$Kind = "Info")
    $statusLabel.Text = $Text
    if ($Kind -eq "Error") {
        $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(180, 45, 20)
    } elseif ($Kind -eq "Ok") {
        $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(20, 120, 70)
    } else {
        $statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(70, 82, 104)
    }
}

$form = New-Object System.Windows.Forms.Form
$form.Text = "Tasmania Dashboard Launcher"
$form.Size = New-Object System.Drawing.Size(760, 520)
$form.StartPosition = "CenterScreen"
$form.Font = New-Object System.Drawing.Font("Segoe UI", 10)

$title = New-Object System.Windows.Forms.Label
$title.Text = "Tasmania Research Dashboard"
$title.Font = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$title.AutoSize = $true
$title.Location = New-Object System.Drawing.Point(24, 22)
$form.Controls.Add($title)

$subtitle = New-Object System.Windows.Forms.Label
$subtitle.Text = "Local deployment, Render deployment, and safe shutdown for local background services."
$subtitle.AutoSize = $true
$subtitle.ForeColor = [System.Drawing.Color]::FromArgb(80, 92, 112)
$subtitle.Location = New-Object System.Drawing.Point(28, 62)
$form.Controls.Add($subtitle)

$apiLabel = New-Object System.Windows.Forms.Label
$apiLabel.Text = "Zhipu API Key for local mode"
$apiLabel.AutoSize = $true
$apiLabel.Location = New-Object System.Drawing.Point(28, 105)
$form.Controls.Add($apiLabel)

$apiBox = New-Object System.Windows.Forms.TextBox
$apiBox.Location = New-Object System.Drawing.Point(28, 130)
$apiBox.Size = New-Object System.Drawing.Size(520, 30)
$apiBox.UseSystemPasswordChar = $true
$apiBox.Text = $env:ZHIPU_API_KEY
$form.Controls.Add($apiBox)

$showKey = New-Object System.Windows.Forms.CheckBox
$showKey.Text = "Show"
$showKey.AutoSize = $true
$showKey.Location = New-Object System.Drawing.Point(565, 132)
$showKey.Add_CheckedChanged({
    $apiBox.UseSystemPasswordChar = -not $showKey.Checked
})
$form.Controls.Add($showKey)

$modelLabel = New-Object System.Windows.Forms.Label
$modelLabel.Text = "Model"
$modelLabel.AutoSize = $true
$modelLabel.Location = New-Object System.Drawing.Point(28, 174)
$form.Controls.Add($modelLabel)

$modelBox = New-Object System.Windows.Forms.TextBox
$modelBox.Location = New-Object System.Drawing.Point(82, 170)
$modelBox.Size = New-Object System.Drawing.Size(160, 30)
$modelBox.Text = "glm-4.7"
$form.Controls.Add($modelBox)

$startButton = New-Object System.Windows.Forms.Button
$startButton.Text = "Start Local"
$startButton.Size = New-Object System.Drawing.Size(190, 42)
$startButton.Location = New-Object System.Drawing.Point(28, 225)
$form.Controls.Add($startButton)

$openLocalButton = New-Object System.Windows.Forms.Button
$openLocalButton.Text = "Open Local"
$openLocalButton.Size = New-Object System.Drawing.Size(190, 42)
$openLocalButton.Location = New-Object System.Drawing.Point(220, 225)
$form.Controls.Add($openLocalButton)

$openRenderButton = New-Object System.Windows.Forms.Button
$openRenderButton.Text = "Open Render"
$openRenderButton.Size = New-Object System.Drawing.Size(220, 42)
$openRenderButton.Location = New-Object System.Drawing.Point(430, 225)
$form.Controls.Add($openRenderButton)

$stopButton = New-Object System.Windows.Forms.Button
$stopButton.Text = "Stop Local"
$stopButton.Size = New-Object System.Drawing.Size(190, 42)
$stopButton.Location = New-Object System.Drawing.Point(28, 282)
$form.Controls.Add($stopButton)

$exitButton = New-Object System.Windows.Forms.Button
$exitButton.Text = "Stop && Exit"
$exitButton.Size = New-Object System.Drawing.Size(190, 42)
$exitButton.Location = New-Object System.Drawing.Point(220, 282)
$form.Controls.Add($exitButton)

$statusTitle = New-Object System.Windows.Forms.Label
$statusTitle.Text = "Status"
$statusTitle.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$statusTitle.AutoSize = $true
$statusTitle.Location = New-Object System.Drawing.Point(28, 345)
$form.Controls.Add($statusTitle)

$statusLabel = New-Object System.Windows.Forms.Label
$statusLabel.Text = "Ready. No local server started by this launcher yet."
$statusLabel.Size = New-Object System.Drawing.Size(650, 64)
$statusLabel.Location = New-Object System.Drawing.Point(28, 373)
$statusLabel.ForeColor = [System.Drawing.Color]::FromArgb(70, 82, 104)
$form.Controls.Add($statusLabel)

$note = New-Object System.Windows.Forms.Label
$note.Text = "Closing this window will stop the local Node server started by this launcher."
$note.AutoSize = $true
$note.ForeColor = [System.Drawing.Color]::FromArgb(120, 80, 20)
$note.Location = New-Object System.Drawing.Point(28, 447)
$form.Controls.Add($note)

$startButton.Add_Click({
    try {
        if (Test-LocalServer) {
            Set-Status "A local server is already listening on port 8787." "Ok"
            return
        }
        $apiKey = $apiBox.Text.Trim()
        if (-not $apiKey) {
            Set-Status "Enter Zhipu API Key before starting local mode." "Error"
            return
        }
        $npm = Get-NpmCommand
        if (-not $npm) {
            Set-Status "npm.cmd was not found. Install Node.js or start with node server.mjs manually." "Error"
            return
        }
        $env:ZHIPU_API_KEY = $apiKey
        $env:ZHIPU_MODEL = $modelBox.Text.Trim()
        $env:PORT = "8787"
        $env:HOST = "127.0.0.1"
        $script:LocalProcess = Start-Process -FilePath $npm -ArgumentList @("start") -WorkingDirectory $ProjectRoot -WindowStyle Hidden -PassThru
        Start-Sleep -Seconds 2
        if (Test-LocalServer) {
            Set-Status "Local server started: $LocalUrl" "Ok"
        } else {
            Set-Status "Tried to start local server, but port 8787 is not listening yet. Check server logs." "Error"
        }
    } catch {
        Set-Status "Start failed: $($_.Exception.Message)" "Error"
    }
})

$openLocalButton.Add_Click({
    if (-not (Test-LocalServer)) {
        Set-Status "Local server is not running. Click Start Local first." "Error"
        return
    }
    Start-Process $LocalUrl
    Set-Status "Opened local dashboard." "Ok"
})

$openRenderButton.Add_Click({
    Start-Process $RenderUrl
    Set-Status "Opened Render deployment. This does not start any local background process." "Ok"
})

$stopButton.Add_Click({
    Stop-LocalServer
    Set-Status "Local server stopped. No local Node server should remain on port 8787." "Ok"
})

$exitButton.Add_Click({
    Stop-LocalServer
    $form.Close()
})

$form.Add_FormClosing({
    Stop-LocalServer
})

[void]$form.ShowDialog()
