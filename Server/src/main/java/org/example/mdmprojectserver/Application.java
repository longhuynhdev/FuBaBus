package org.example.mdmprojectserver;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

// The former DataSource/HibernateJpa excludes were dropped: Spring Boot 4 moved those
// auto-configurations into optional modules that this project does not depend on, so
// there is nothing left to exclude.
@SpringBootApplication

@EnableMongoRepositories(
    basePackages = "org.example.mdmprojectserver.mongodb.repository"
)

@OpenAPIDefinition(info = @Info(title = "FuBaBus API", version = "1.0", description = "FuBaBus API"))
public class Application implements CommandLineRunner {
    public Application() {
    }

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Override
    public void run(String... args) {


    }

}
