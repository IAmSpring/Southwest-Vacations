# Southwest Vacations API Testing Script
# This PowerShell script helps test various API endpoints of the Southwest Vacations application

# Variables
$ApiUrl = "http://localhost:4000"
$AuthToken = ""
$BookingId = ""
$FavoriteId = ""

# Function to show help
function Show-Help {
    Write-Host "Southwest Vacations API Testing Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\test-api.ps1 [command]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  health             - Check if the API is running"
    Write-Host "  register           - Register a new user"
    Write-Host "  login              - Login and get authentication token"
    Write-Host "  profile            - Get user profile (requires login first)"
    Write-Host "  trips              - Get all trips"
    Write-Host "  trip <id>          - Get a specific trip by ID"
    Write-Host "  search <query>     - Search trips (e.g., 'destination=Hawaii&minPrice=1000')"
    Write-Host "  book               - Create a booking (requires login first)"
    Write-Host "  my-bookings        - Get user's bookings (requires login first)"
    Write-Host "  booking <id>       - Get specific booking details (requires login first)"
    Write-Host "  cancel <id>        - Cancel a booking (requires login first)"
    Write-Host "  favorite <tripId>  - Add a trip to favorites (requires login first)"
    Write-Host "  my-favorites       - Get user's favorites (requires login first)"
    Write-Host "  unfavorite <id>    - Remove from favorites (requires login first)"
    Write-Host "  all                - Run all tests in sequence (register, login, etc.)"
    Write-Host "  help               - Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\test-api.ps1 health"
    Write-Host "  .\test-api.ps1 register"
    Write-Host "  .\test-api.ps1 login"
    Write-Host "  .\test-api.ps1 trips"
    Write-Host "  .\test-api.ps1 trip trip1"
    Write-Host "  .\test-api.ps1 all"
}

# Function to check if API is running
function Check-Health {
    Write-Host "Checking API health..." -ForegroundColor Blue
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/health" -Method Get
        $response | ConvertTo-Json
        return $true
    }
    catch {
        Write-Host "API is not responding. Make sure it's running at $ApiUrl" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $false
    }
}

# Function to register a new user
function Register-User {
    Write-Host "Registering a new user..." -ForegroundColor Blue
    $body = @{
        username = "testuser"
        email = "test@example.com"
        password = "Password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/users/register" -Method Post -Body $body -ContentType "application/json"
        $response | ConvertTo-Json
    }
    catch {
        Write-Host "Registration failed" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to login
function Login-User {
    Write-Host "Logging in..." -ForegroundColor Blue
    $body = @{
        email = "test@example.com"
        password = "Password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/users/login" -Method Post -Body $body -ContentType "application/json"
        $response | ConvertTo-Json
        
        # Save token
        $script:AuthToken = $response.token
        if ($script:AuthToken) {
            Write-Host "Login successful. Token saved." -ForegroundColor Green
        }
        else {
            Write-Host "Login failed. No token received." -ForegroundColor Red
        }
    }
    catch {
        Write-Host "Login failed" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to get user profile
function Get-UserProfile {
    if (!$script:AuthToken) {
        Write-Host "No authentication token. Please login first." -ForegroundColor Red
        return
    }
    
    Write-Host "Getting user profile..." -ForegroundColor Blue
    try {
        $headers = @{
            "Authorization" = "Bearer $script:AuthToken"
        }
        $response = Invoke-RestMethod -Uri "$ApiUrl/users/me" -Method Get -Headers $headers
        $response | ConvertTo-Json
    }
    catch {
        Write-Host "Failed to get profile" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to get all trips
function Get-Trips {
    Write-Host "Getting all trips..." -ForegroundColor Blue
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/trips" -Method Get
        $response | ConvertTo-Json
    }
    catch {
        Write-Host "Failed to get trips" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to get a specific trip
function Get-Trip {
    param (
        [string]$tripId
    )
    
    if (!$tripId) {
        Write-Host "Trip ID is required. Example: .\test-api.ps1 trip trip1" -ForegroundColor Red
        return
    }
    
    Write-Host "Getting trip details for $tripId..." -ForegroundColor Blue
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/trips/$tripId" -Method Get
        $response | ConvertTo-Json
    }
    catch {
        Write-Host "Failed to get trip details" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to search trips
function Search-Trips {
    param (
        [string]$query
    )
    
    Write-Host "Searching trips with query: $query" -ForegroundColor Blue
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/trips/search?$query" -Method Get
        $response | ConvertTo-Json
    }
    catch {
        Write-Host "Search failed" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to create a booking
function New-Booking {
    if (!$script:AuthToken) {
        Write-Host "No authentication token. Please login first." -ForegroundColor Red
        return
    }
    
    Write-Host "Creating a booking..." -ForegroundColor Blue
    $body = @{
        tripId = "trip1"
        fullName = "Test User"
        email = "test@example.com"
        travelers = 2
        startDate = "2025-08-01"
    } | ConvertTo-Json
    
    try {
        $headers = @{
            "Authorization" = "Bearer $script:AuthToken"
        }
        $response = Invoke-RestMethod -Uri "$ApiUrl/bookings" -Method Post -Body $body -ContentType "application/json" -Headers $headers
        $response | ConvertTo-Json
        
        # Save booking ID
        $script:BookingId = $response.bookingId
        if ($script:BookingId) {
            Write-Host "Booking created. ID saved: $script:BookingId" -ForegroundColor Green
        }
        else {
            Write-Host "Booking creation failed." -ForegroundColor Red
        }
    }
    catch {
        Write-Host "Booking creation failed" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to get user's bookings
function Get-UserBookings {
    if (!$script:AuthToken) {
        Write-Host "No authentication token. Please login first." -ForegroundColor Red
        return
    }
    
    Write-Host "Getting user's bookings..." -ForegroundColor Blue
    try {
        $headers = @{
            "Authorization" = "Bearer $script:AuthToken"
        }
        $response = Invoke-RestMethod -Uri "$ApiUrl/bookings/user" -Method Get -Headers $headers
        $response | ConvertTo-Json
    }
    catch {
        Write-Host "Failed to get bookings" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to get booking details
function Get-BookingDetails {
    param (
        [string]$bookingId
    )
    
    if (!$script:AuthToken) {
        Write-Host "No authentication token. Please login first." -ForegroundColor Red
        return
    }
    
    $id = $bookingId
    if (!$id -and $script:BookingId) {
        $id = $script:BookingId
    }
    
    if (!$id) {
        Write-Host "Booking ID is required. Example: .\test-api.ps1 booking <id>" -ForegroundColor Red
        return
    }
    
    Write-Host "Getting booking details for $id..." -ForegroundColor Blue
    try {
        $headers = @{
            "Authorization" = "Bearer $script:AuthToken"
        }
        $response = Invoke-RestMethod -Uri "$ApiUrl/bookings/$id" -Method Get -Headers $headers
        $response | ConvertTo-Json
    }
    catch {
        Write-Host "Failed to get booking details" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to cancel a booking
function Cancel-Booking {
    param (
        [string]$bookingId
    )
    
    if (!$script:AuthToken) {
        Write-Host "No authentication token. Please login first." -ForegroundColor Red
        return
    }
    
    $id = $bookingId
    if (!$id -and $script:BookingId) {
        $id = $script:BookingId
    }
    
    if (!$id) {
        Write-Host "Booking ID is required. Example: .\test-api.ps1 cancel <id>" -ForegroundColor Red
        return
    }
    
    Write-Host "Cancelling booking $id..." -ForegroundColor Blue
    try {
        $headers = @{
            "Authorization" = "Bearer $script:AuthToken"
        }
        $response = Invoke-RestMethod -Uri "$ApiUrl/bookings/$id/cancel" -Method Patch -Headers $headers
        $response | ConvertTo-Json
    }
    catch {
        Write-Host "Cancellation failed" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to add a trip to favorites
function Add-Favorite {
    param (
        [string]$tripId
    )
    
    if (!$script:AuthToken) {
        Write-Host "No authentication token. Please login first." -ForegroundColor Red
        return
    }
    
    if (!$tripId) {
        Write-Host "Trip ID is required. Example: .\test-api.ps1 favorite trip2" -ForegroundColor Red
        return
    }
    
    Write-Host "Adding trip $tripId to favorites..." -ForegroundColor Blue
    $body = @{
        tripId = $tripId
    } | ConvertTo-Json
    
    try {
        $headers = @{
            "Authorization" = "Bearer $script:AuthToken"
        }
        $response = Invoke-RestMethod -Uri "$ApiUrl/favorites" -Method Post -Body $body -ContentType "application/json" -Headers $headers
        $response | ConvertTo-Json
        
        # Save favorite ID
        $script:FavoriteId = $response.id
        if ($script:FavoriteId) {
            Write-Host "Trip added to favorites. ID saved: $script:FavoriteId" -ForegroundColor Green
        }
        else {
            Write-Host "Failed to add to favorites." -ForegroundColor Red
        }
    }
    catch {
        Write-Host "Failed to add to favorites" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to get user's favorites
function Get-Favorites {
    if (!$script:AuthToken) {
        Write-Host "No authentication token. Please login first." -ForegroundColor Red
        return
    }
    
    Write-Host "Getting user's favorites..." -ForegroundColor Blue
    try {
        $headers = @{
            "Authorization" = "Bearer $script:AuthToken"
        }
        $response = Invoke-RestMethod -Uri "$ApiUrl/favorites" -Method Get -Headers $headers
        $response | ConvertTo-Json
    }
    catch {
        Write-Host "Failed to get favorites" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to remove from favorites
function Remove-Favorite {
    param (
        [string]$favoriteId
    )
    
    if (!$script:AuthToken) {
        Write-Host "No authentication token. Please login first." -ForegroundColor Red
        return
    }
    
    $id = $favoriteId
    if (!$id -and $script:FavoriteId) {
        $id = $script:FavoriteId
    }
    
    if (!$id) {
        Write-Host "Favorite ID is required. Example: .\test-api.ps1 unfavorite <id>" -ForegroundColor Red
        return
    }
    
    Write-Host "Removing favorite $id..." -ForegroundColor Blue
    try {
        $headers = @{
            "Authorization" = "Bearer $script:AuthToken"
        }
        $response = Invoke-RestMethod -Uri "$ApiUrl/favorites/$id" -Method Delete -Headers $headers
        $response | ConvertTo-Json
    }
    catch {
        Write-Host "Failed to remove favorite" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Function to run all tests
function Run-AllTests {
    Write-Host "=== Running all tests in sequence ===" -ForegroundColor Magenta
    $healthCheck = Check-Health
    if (!$healthCheck) {
        return
    }
    Register-User
    Login-User
    Get-UserProfile
    Get-Trips
    Get-Trip -tripId "trip1"
    Search-Trips -query "destination=Hawaii"
    New-Booking
    Get-UserBookings
    Get-BookingDetails
    Add-Favorite -tripId "trip2"
    Get-Favorites
    Remove-Favorite
    Cancel-Booking
    Write-Host "=== All tests completed ===" -ForegroundColor Magenta
}

# Main script logic
$command = $args[0]
$param = $args[1]

switch ($command) {
    "health" { Check-Health }
    "register" { Register-User }
    "login" { Login-User }
    "profile" { Get-UserProfile }
    "trips" { Get-Trips }
    "trip" { Get-Trip -tripId $param }
    "search" { Search-Trips -query $param }
    "book" { New-Booking }
    "my-bookings" { Get-UserBookings }
    "booking" { Get-BookingDetails -bookingId $param }
    "cancel" { Cancel-Booking -bookingId $param }
    "favorite" { Add-Favorite -tripId $param }
    "my-favorites" { Get-Favorites }
    "unfavorite" { Remove-Favorite -favoriteId $param }
    "all" { Run-AllTests }
    "help" { Show-Help }
    "" { Show-Help }
    default { 
        Write-Host "Unknown command: $command" -ForegroundColor Red
        Show-Help
    }
} 