package org.example.mdmprojectserver.mongodb.controller;

import jakarta.validation.Valid;
import org.example.mdmprojectserver.mongodb.dto.AuthResponseDto;
import org.example.mdmprojectserver.mongodb.dto.LoginDto;
import org.example.mdmprojectserver.mongodb.dto.RegisterDto;
import org.example.mdmprojectserver.mongodb.enums.Gender;
import org.example.mdmprojectserver.mongodb.model.Customer;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.example.mdmprojectserver.mongodb.security.JWTGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {
    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;
    private JWTGenerator jwtGenerator;
    private CustomerRepository customerRepository;
    @Autowired
    public AuthController(AuthenticationManager authenticationManager
            , PasswordEncoder passwordEncoder, JWTGenerator jwtGenerator, CustomerRepository customerRepository)
    {
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtGenerator = jwtGenerator;
        this.customerRepository = customerRepository;
    }

    @PostMapping("register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterDto registerDto, BindingResult result) {

        //TODO: Add validation for phone number format and email format
//        if (result.hasErrors()) {
//            return ResponseEntity.badRequest().body("Validation errors: " + result.getAllErrors());
//        }
//
//        if(customerRepository.findByPhone(registerDto.getPhone()).isPresent()) {
//            return new ResponseEntity<>("Phone number is already in the system", HttpStatus.BAD_REQUEST);
//        }

        Customer customer = new Customer();
        customer.setPhone(registerDto.getPhone());
        customer.setEmail(registerDto.getEmail());
        customer.setName(registerDto.getName());
        customer.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        customer.setRole("USER");
        customer.setGender(Gender.MALE);

        customerRepository.save(customer);

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

    @PostMapping("login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginDto loginDto) {
        // Find customer first
        Customer customer = customerRepository.findByPhone(loginDto.getPhone())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Verify password
        if (!passwordEncoder.matches(loginDto.getPassword(), customer.getPassword())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Create authentication token
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                customer.getPhone(),
                loginDto.getPassword()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        return new ResponseEntity<>(new AuthResponseDto(token, customer.getId()), HttpStatus.OK);
    }
}
