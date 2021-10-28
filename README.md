# Food Tinder

# backend - data-services

    - Spring Boot Application with MongoDB

    Follow steps to run data-services

    1. run "./mvnw clean package"
    2. Move *.jar file from ./target -> ./docker
    3. In docker directory run docker-compose build
    4. Run docker-compose up (optional with "-d")
    5. Test with "curl localhost:8080/"
    6. Expected result: "Greetings from data-services in Yumatch!"
