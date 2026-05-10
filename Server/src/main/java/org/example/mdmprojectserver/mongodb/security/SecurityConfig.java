package org.example.mdmprojectserver.mongodb.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity

//Everything has been deprecated
// https://docs.spring.io/spring-security/reference/5.8/migration/servlet/config.html

public class SecurityConfig {
    private JwtAuthEntryPoint authEntryPoint;
    private UserDetailsService userDetailsService;


    @Autowired
    public SecurityConfig(UserDetailsService userDetailsService, JwtAuthEntryPoint authEntryPoint) {
        this.userDetailsService = userDetailsService;
        this.authEntryPoint = authEntryPoint;

    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/buses/**").permitAll()
                        .requestMatchers("/api/buses/search").permitAll()
                        .requestMatchers("/api/bookings/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tickets/*/phone/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/invoices/phone/**").permitAll()
                        .requestMatchers("/api/admin/**").hasAnyRole("EMPLOYEE", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/buses/**").hasAnyRole("EMPLOYEE", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/buses/**").hasAnyRole("EMPLOYEE", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/buses/**").hasAnyRole("EMPLOYEE", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/tickets/**").hasAnyRole("EMPLOYEE", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/invoices/**").hasAnyRole("EMPLOYEE", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/customers/**").hasAnyRole("EMPLOYEE", "ADMIN")
                        .anyRequest().authenticated()
                )
                .httpBasic(withDefaults())
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authEntryPoint)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JWTAuthenticationFilter jwtAuthenticationFilter() {
        return new JWTAuthenticationFilter();
    }
}
