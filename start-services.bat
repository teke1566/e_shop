@echo off
echo Starting Eureka Server...
start cmd /k "cd service-registry && mvn spring-boot:run"
timeout /t 8 >nul

echo Starting Config Server...
start cmd /k "cd config-server && mvn spring-boot:run"
timeout /t 8 >nul

echo Starting Auth Service...
start cmd /k "cd auth-service && mvn spring-boot:run"
timeout /t 6 >nul

echo Starting Category Service...
start cmd /k "cd category && mvn spring-boot:run"
timeout /t 5 >nul

echo Starting Product Service...
start cmd /k "cd product && mvn spring-boot:run"
timeout /t 5 >nul

echo Starting Payment Service...
start cmd /k "cd payment-service && mvn spring-boot:run"
timeout /t 5 >nul

echo Starting Order Service...
start cmd /k "cd order-service && mvn spring-boot:run"
timeout /t 5 >nul

echo Starting API Gateway...
start cmd /k "cd api-gateway && mvn spring-boot:run"
echo All services started!
