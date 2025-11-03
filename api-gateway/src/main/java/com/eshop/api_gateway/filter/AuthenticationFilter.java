package com.eshop.api_gateway.filter;

import com.eshop.api_gateway.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private RouteValidator routeValidator;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();

            // Skip auth endpoints to prevent self-blocking
            if (path.startsWith("/api/auth")) {
                System.out.println("🔓 Skipping filter for public auth path: " + path);
                return chain.filter(exchange);
            }

            System.out.println("🔐 Checking secured route: " + path);

            if (routeValidator.isSecured.test(request)) {
                String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                System.out.println("➡️ Authorization Header: " + authHeader);

                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    System.out.println("❌ Missing or invalid Authorization header");
                    return onError(exchange, "Missing or invalid Authorization header", HttpStatus.UNAUTHORIZED);
                }

                String token = authHeader.substring(7);
                try {
                    jwtUtil.validateToken(token);
                    System.out.println("✅ Token successfully validated for: " + path);
                } catch (Exception e) {
                    System.out.println("❌ JWT validation failed: " + e.getMessage());
                    e.printStackTrace();
                    return onError(exchange, "Unauthorized: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
                }
            } else {
                System.out.println("🟢 Non-secured route, skipping authentication for: " + path);
            }

            return chain.filter(exchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        System.out.println("🚫 Responding with " + status + " — " + message);
        exchange.getResponse().setStatusCode(status);
        return exchange.getResponse().setComplete();
    }

    public static class Config {
        // Empty config for now
    }
}
