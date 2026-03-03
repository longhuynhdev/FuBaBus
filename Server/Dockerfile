# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml first to cache dependency downloads in a separate layer.
# Dependencies are only re-downloaded when pom.xml changes.
COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn package -DskipTests -B

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine

# Run as a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
