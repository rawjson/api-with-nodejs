# Node.js x Express.js Backend APIs Example App

This is a working example of Node.js and Express.js App to explain the working of a simple backend APIs. Created to explain how APIs work with express.

To get started run the following command

```
$ npm run install
```

A dockerfile is also available in case you want to use the containerize and ship it. To build a containerized app use the following command.

```
docker build -t api-with-node:v1 .
```

Then run the container using the following command

```
docker run -p 8080:8080 -it api-with-node:v1
```
