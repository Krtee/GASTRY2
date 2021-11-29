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


    Problems with Mongo Container starting? (Exit code 14)
     - Delete folder 'databases' in docker/
     - Try building and running docker containers again
        1. docker-compose build --no-cache
        2. docker-compose up
     - It works!....
     - If not: Delete container, restart docker and repeat steps.

     If you want to run a local/dockerized version of the Spring Application:
     - We have two different properties files in resources/
         - local.properties (default) connects to a local mongodb instance, hence the localhost present in the mongo uri
         - prod.properties for when running both Spring and Mongo via Docker containers
     - If you want to build your package so it takes the prod.properties and runs without tests, do the following:
         - ./mvnw Pprod -Dmaven.test.skip=true clean package
         - There you have your .jar file with the prod.properties
# Docker Image

Das aktuellste Image kann immer [hier](https://hub.docker.com/repository/docker/bassamxmednini/yumatch) gefunden werden.
