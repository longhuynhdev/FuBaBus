package org.example.mdmprojectserver.mongodb.security;

import org.example.mdmprojectserver.mongodb.model.Customer;
import org.example.mdmprojectserver.mongodb.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import org.example.mdmprojectserver.mongodb.enums.Role;

import java.util.Collection;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private CustomerRepository customerRepository;

    @Autowired
    public CustomUserDetailsService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByPhone(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
        // customer.active is honoured here so a deactivated account cannot log in — without it,
        // deactivation would have no effect on authentication at all.
        return User.withUsername(customer.getPhone())
                .password(customer.getPassword())
                .disabled(!customer.isActive())
                .authorities(mapRolesToAuthorities(customer.getRole()))
                .build();
    }

    private Collection<GrantedAuthority> mapRolesToAuthorities(Role role) {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
}
