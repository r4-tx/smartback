param(
    [string]$DbHost = "localhost",
    [string]$DbPort = "5433",
    [string]$DbName = "smartjava",
    [string]$DbUser = "postgres",
    [string]$ApiPort = "8081",
    [switch]$UseLocalProfile
)

$ErrorActionPreference = "Stop"

function Convert-SecureToPlainText([Security.SecureString]$secure) {
    if (-not $secure) { return "" }
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
}

function Resolve-MavenCommand {
    $mvnInPath = Get-Command mvn -ErrorAction SilentlyContinue
    if ($mvnInPath) { return $mvnInPath.Source }

    $mvnCmdInPath = Get-Command mvn.cmd -ErrorAction SilentlyContinue
    if ($mvnCmdInPath) { return $mvnCmdInPath.Source }

    $userTools = Join-Path $env:USERPROFILE "tools"
    if (Test-Path $userTools) {
        $localMaven = Get-ChildItem -Path $userTools -Directory -Filter "apache-maven-*" -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending |
            Select-Object -First 1

        if ($localMaven) {
            $candidate = Join-Path $localMaven.FullName "bin\\mvn.cmd"
            if (Test-Path $candidate) {
                $env:MAVEN_HOME = $localMaven.FullName
                $env:Path = "$($localMaven.FullName)\\bin;$env:Path"
                return $candidate
            }
        }
    }

    return $null
}

Write-Host "== SmartStock backend startup ==" -ForegroundColor Cyan
Write-Host "Host: $DbHost | Port: $DbPort | DB: $DbName | User: $DbUser" -ForegroundColor DarkGray

$securePassword = Read-Host "Digite a senha do PostgreSQL para '$DbUser'" -AsSecureString
$dbPassword = Convert-SecureToPlainText $securePassword

if ([string]::IsNullOrWhiteSpace($dbPassword)) {
    throw "Senha vazia. Abortei para evitar novo erro de autenticacao."
}

$env:DB_HOST = $DbHost
$env:DB_PORT = $DbPort
$env:DB_NAME = $DbName
$env:DB_USER = $DbUser
$env:DB_PASSWORD = $dbPassword
$env:SERVER_PORT = $ApiPort

if ($UseLocalProfile) {
    $env:SPRING_PROFILES_ACTIVE = "dev,local"
}
else {
    $env:SPRING_PROFILES_ACTIVE = "dev"
}

Write-Host "Subindo API com perfil: $env:SPRING_PROFILES_ACTIVE" -ForegroundColor Green
Write-Host "Se der erro de conexao, revise usuario/senha no pgAdmin." -ForegroundColor Yellow

$mavenCmd = Resolve-MavenCommand
if (-not $mavenCmd) {
    throw "Maven não encontrado. Instale ou mantenha em '$env:USERPROFILE\tools\apache-maven-<versao>\bin\mvn.cmd'."
}

Write-Host "Usando Maven em: $mavenCmd" -ForegroundColor DarkGray
& $mavenCmd spring-boot:run
