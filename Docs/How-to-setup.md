## Prerequisites
Ensure you have the following software installed before setting up the project:
- **Java 21** and **Maven**
- **Node.js** and **npm** (or **Bun**)
- **Docker** and **Docker Desktop** 


## Building and Running the Project Locally

### Client Setup
1. Navigate to the `Client` directory.
2. Choose your preferred package manager:

   **Using `npm`:**
   ```bash
   npm install
   npm run dev
   ```

    **Using `bun`:**
    ```bash
    bun install
    bun run dev
    ```
The client will be running at http://localhost:5173.
### Server Setup
#### Setting up and Running Databases with Docker
Before running the backend, you must initialize the databases.
##### MongoDB
Run MongoDB using Docker with the following command:
```docker
docker run -d -p 27017:27017 --name mongo -e MONGO_INITDB_ROOT_USERNAME=mongo -e MONGO_INITDB_ROOT_PASSWORD=mongo mongodb/mongodb-community-server:latest
```
##### Redis
Run Redis using Docker with the following command. The `--notify-keyspace-events Ex` flag is required for the seat reservation TTL expiry listener to work.
```docker
docker run -d -p 6379:6379 --name redis redis:latest --notify-keyspace-events Ex
```

(Optional) To access the Redis CLI
```docker
docker exec -it redis redis-cli
```

#### Running the Server
1. Navigate to the `Server` directory.
2. The server can be launched using: `./mvnw spring-boot:run -Dspring-boot.run.profiles=dev`

The server will be running at `http://localhost:8080`

**Important Note**: Ensure your Spring Boot `application.properties` matches these database credentials

## Accessing the Application
Once everything is up and running:
- Client App: http://localhost:5173
- API Server: http://localhost:8080
- Swagger UI (API Docs): http://localhost:8080/swagger-ui/index.html