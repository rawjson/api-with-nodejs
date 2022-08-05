# Node.js x Express.js Backend APIs Example App

This is a working example of Node.js and Express.js App to explain the working of a simple backend APIs. Created to explain how APIs work with express.

Use the following to signin:

```
{
    "username": "johndoe",
    "password": "password"
}
```

`POST /signin`
: 'signin to the app'

`GET /all`
: 'get all employees'

`POST /add`
: 'add a new employee'

`DELETE /:id`: 'deletes an employee'

`GET /ss`: 'Get summary statistics'

`QUERY /ss`
: 'query the /ss with conditions "on_contract=true/false" Or call employees of a department or sub_department',

---

To get started run the following command and install dependencies:

```
$ npm run install
```

Run the development server:

```
$ npm run dev
```

Start the production server:

```
$ npm run start
```

A dockerfile is also available in case you want to use the containerize and ship it. To build a containerized app use the following command.

```
docker build -t api-with-node:v1 .
```

Then run the container using the following command

```
docker run -p 8080:8080 -it api-with-node:v1
```
