package org.example.mdmprojectserver.mongodb.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class WebConfig {

    /**
     * Single source of CORS truth for both MVC and the security filter chain.
     *
     * <p>This used to be a {@code WebMvcConfigurer.addCorsMappings} registration, which MVC
     * honoured but Spring Security never saw — so the filter chain rejected the unauthenticated
     * preflight with a 401 before MVC could answer it. Exposing it as a bean lets
     * {@code http.cors(...)} in {@link SecurityConfig} pick up the same configuration.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "https://fubabus.longhuynh.dev"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
