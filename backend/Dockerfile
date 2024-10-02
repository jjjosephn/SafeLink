# Use an OpenJDK 17 base image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper script
COPY mvnw ./
COPY .mvn .mvn
COPY pom.xml ./

# Ensure mvnw is executable
RUN chmod +x mvnw

# Download the dependencies
RUN ./mvnw dependency:go-offline -B

# Copy the rest of the project files
COPY src ./src

# Package the application
RUN ./mvnw package -DskipTests

# Expose the port your application runs on
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "target/ContactAPI-0.0.1-SNAPSHOT.jar"]
