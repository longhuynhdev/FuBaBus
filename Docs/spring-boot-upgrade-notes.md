# Spring Boot Upgrade Notes

## Current State (as of 2026-03-07)

| Dependency | Previous Version | Current Version |
|---|---|---|
| Spring Boot | 3.2.4 | 3.5.11 |
| Java | 21 | 25 |
| Lombok | managed by parent | 1.18.42 |

## What Changed and Why

### 1. Java 25 Requires Explicit Annotation Processing (JDK 23+)

Since JDK 23, `javac` no longer runs annotation processors automatically from the classpath ([JDK-8321319](https://bugs.openjdk.org/browse/JDK-8321319)). Lombok relies on annotation processing, so we must configure it explicitly in the `maven-compiler-plugin`:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.42</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

If you add other annotation processors in the future (e.g. MapStruct), add them here too.

### 2. Lombok Version Pinned Explicitly

The Lombok version managed by Spring Boot's parent BOM may lag behind JDK support. We pin it explicitly in both the `<dependency>` and `<annotationProcessorPaths>` to ensure JDK 25 compatibility. When upgrading Lombok, update it in **both places**.

### 3. Removed Hardcoded Versions on Spring Boot Starters

`spring-boot-starter-cache` and `spring-boot-starter-data-redis` had hardcoded `<version>3.2.3</version>`. These are managed by the Spring Boot parent BOM and should not have explicit versions — it causes version mismatches.

### 4. Spring Profile Separation

- `application.properties` — shared config only (autoconfigure excludes, ANSI output)
- `application-dev.properties` — local development (Redis localhost, MongoDB localhost)
- `application-prod.properties` — production (env vars for connection strings)

Run locally with: `./mvnw spring-boot:run -Dspring-boot.run.profiles=dev`

## Future Upgrade: Spring Boot 3.5.x → 4.0.x

When ready to upgrade to Spring Boot 4.0, be aware of these major changes:

| Area | 3.5.x | 4.0.x |
|---|---|---|
| Spring Framework | 6.2.x | 7.0.x |
| Spring Security | 6.x | 7.0 |
| Hibernate | 6.x | 7.x |
| Minimum Java | 17 | 17 |

### Key breaking changes to prepare for:

1. **Spring Security 7** — Security filter chain config API changes. Review [Spring Security migration guide](https://docs.spring.io/spring-security/reference/migration-7/index.html).
2. **Hibernate 7** — Entity mapping and query behavior changes. Review [Hibernate migration guide](https://github.com/hibernate/hibernate-orm/blob/main/migration-guide.adoc).
3. **Deprecation removals** — Anything deprecated in 3.x may be removed in 4.0. Run your build with `-Xlint:deprecation` to find usages.
4. **Jakarta EE** — Already on Jakarta (since Boot 3.0), but some namespace changes may apply.

### Recommended upgrade path:

1. Fix all deprecation warnings on current version first
2. Read the release notes for each minor version between current and target:
   - [3.5 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-3.5-Release-Notes)
   - [4.0 Release Notes](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Release-Notes)
3. Add `spring-boot-properties-migrator` temporarily to catch renamed properties:
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-properties-migrator</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```
4. Upgrade, fix compilation errors, then run all tests
5. Remove the properties-migrator dependency after migration is complete

## Useful References

- [Spring Boot Upgrade Guide](https://docs.spring.io/spring-boot/upgrading.html)
- [Spring Boot End of Life Dates](https://endoflife.date/spring-boot)
- [Lombok Changelog](https://projectlombok.org/changelog)
- [Lombok Maven Setup](https://projectlombok.org/setup/maven)
