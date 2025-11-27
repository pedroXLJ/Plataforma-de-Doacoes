FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app

# copy pom and src to leverage Docker layer caching
COPY pom.xml ./
COPY src ./src

# build the application (skip tests for faster build)
RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app

# copy the built jar from the build stage
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar
COPY wait-for-db.sh /app/wait-for-db.sh

# install netcat for the wait script and clean up apt caches
RUN apt-get update \
    && apt-get install -y netcat-openbsd \
    && rm -rf /var/lib/apt/lists/* \
    && chmod +x /app/wait-for-db.sh

EXPOSE 8080

# Use wait-for-db.sh to wait for MySQL before starting the app
CMD ["/app/wait-for-db.sh"]
