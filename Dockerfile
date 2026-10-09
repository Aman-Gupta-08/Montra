FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
ENV MAVEN_OPTS="-Xmx400m -XX:+UseSerialGC"
COPY pom.xml .
RUN mvn dependency:resolve -B
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Xmx384m", "-jar", "app.jar"]
