package org.example.mdmprojectserver.mongodb.controller;

import jakarta.validation.Valid;
import org.example.mdmprojectserver.mongodb.dto.AuthResponseDto;
import org.example.mdmprojectserver.mongodb.dto.LoginDto;
import org.example.mdmprojectserver.mongodb.dto.RefreshRequestDto;
import org.example.mdmprojectserver.mongodb.dto.RegisterDto;
import org.example.mdmprojectserver.mongodb.enums.Gender;
import org.example.mdmprojectserver.mongodb.enums.Role;
import org.example.mdmprojectserver.mongodb.model.Customer;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.example.mdmprojectserver.mongodb.security.JWTGenerator;
import org.example.mdmprojectserver.redis.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;
    private JWTGenerator jwtGenerator;
    private CustomerRepository customerRepository;
    private RefreshTokenService refreshTokenService;
    @Autowired
    public AuthController(AuthenticationManager authenticationManager
            , PasswordEncoder passwordEncoder, JWTGenerator jwtGenerator, CustomerRepository customerRepository
            , RefreshTokenService refreshTokenService)
    {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
        this.customerRepository = customerRepository;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterDto registerDto) {
        if(customerRepository.findByPhone(registerDto.getPhone()).isPresent()) {
            return new ResponseEntity<>("Phone number is already in the system", HttpStatus.BAD_REQUEST);
        }

        Customer customer = new Customer();
        customer.setPhone(registerDto.getPhone());
        customer.setEmail(registerDto.getEmail());
        customer.setName(registerDto.getName());
        customer.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        customer.setRole(Role.USER);
        customer.setGender(Gender.MALE);

        customerRepository.save(customer);

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

    @PostMapping("login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getPhone(), loginDto.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        Customer customer = customerRepository.findByPhone(loginDto.getPhone())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String token = jwtGenerator.generateToken(authentication, customer.getRole().name());
        String refreshToken = refreshTokenService.issue(customer.getId());

        return new ResponseEntity<>(new AuthResponseDto(token, refreshToken, customer.getId(), customer.getRole().name()), HttpStatus.OK);
    }

    /**
     * Exchanges a refresh token for a new access token, rotating the refresh token in the
     * process. The customer is re-read here, so a deactivated or deleted account stops being
     * able to refresh — which is what bounds how long a stale access token stays useful.
     */
    @PostMapping("refresh")
    public ResponseEntity<AuthResponseDto> refresh(@Valid @RequestBody RefreshRequestDto refreshRequestDto) {
        String customerId = refreshTokenService.consume(refreshRequestDto.getRefreshToken());
        if (customerId == null) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        Customer customer = customerRepository.findById(customerId)
                .filter(Customer::isActive)
                .orElseThrow(() -> new BadCredentialsException("Account is no longer active"));

        String token = jwtGenerator.generateToken(customer.getPhone(), customer.getRole().name());
        String rotatedRefreshToken = refreshTokenService.issue(customer.getId());

        return new ResponseEntity<>(new AuthResponseDto(token, rotatedRefreshToken, customer.getId(), customer.getRole().name()), HttpStatus.OK);
    }

    /** Revokes a refresh token. The access token remains valid until it expires. */
    @PostMapping("logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequestDto refreshRequestDto) {
        refreshTokenService.revoke(refreshRequestDto.getRefreshToken());
        return ResponseEntity.noContent().build();
    }
}
