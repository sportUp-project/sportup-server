# SportUP API

The API that is used in our last project at Ironhack. We applied the REST guidelines for creating an API.

## Routes

The API supports the following routes:
______________

| Description | Route | Method | Expects | Description | Returns | Error |
| ----------- | ----------- |  ----------- | ----------- | ----------- | ----------- | ----------- |
| AUTH | /auth/signup | POST | email, name, password in form-encode | Sign up a user | 201, {email, name, _id} | 500, Internal server Error |
| AUTH | /auth/login | POST | email, password in form-encode | Login a user | 200, {JWT, userId} | 401, Unable to authenticate / User not found |
| AUTH | /auth/verify | GET | A header : '{ Authorization: `Bearer ${storedToken}` }' | Authenticate the JWT | 200, {user} | 500, Internal server error
| API | /api/activities | GET | - | Get all activities | 200, [{activity}] | 500, Internal server error |
| API | /api/activities/:activityID | GET | Valid activity ID in URL /  A header : '{ Authorization: `Bearer ${storedToken}` }'  | Get details about activity | 200, {activity} | 400, Specified id is not valid / 401 Wrong credentials |
| API | /api/sports | GET | - | Get all sports and their activities | 200, [{sport}] | 500, Internal server error |
| API | /api/sports | POST |  name, iconUrl, imageUrl in form-encode | Create a new Sport |  200, {sport} | 500, Internal server error |
| API | /api/sports/:sportID | GET | Valid sport ID in URL | Get details about a Sport | 200, {sport}, populated | 400, Specified id is not valid |

## Try out our API

https://sportup-server.cyclic.app/api

Currently hosted at cyclic our API is fully functional and can be tested via POSTMAN/Insomnia/ any other client. Feel free to give it a shot and see what [activities we have stored.](https://sportup-server.cyclic.app/api/activities)

## Technologies used

- Node JS
- Express JS
- Mongoose / MongoDB
- Cloudinary / Mutler
- bcryptjs
- jsonwebtoken

## Installation

If you want to install our API on your own host:

1. Clone the repository
2. Run "npm -i" to install all packages
3. Create a .env file in root directory and set the proper variables:
    - PORT=
    - ORIGIN=
    - MONGODB_URI=
    - TOKEN_SECRET=
    - CLOUDINARY_NAME=
    - CLOUDINARY_KEY=
    - CLOUDINARY_SECRET=
4. Run "npm run dev" to run the server through nodemon
5. Run "npm run start" to run the server for normal operation
6. If everything is set up correctly you should get this message: 
```bash
Server listening on port <url:port>
Connected to Mongo! Database name: <database name>
```

