# TourAxis Assignment - Nik

## Features

- Dockerised setup
- Automated Swagger/OpenAPI specification/documation page generation - try going to `/api-docs`!
- Basic Jest tests
- Storage to a SQLite database
- Postman collection for testing
- Scheduled job running every minute

## Setup & Running

- Run `./init.sh`. Failing that, run `./init_nodocker.sh`.
- Import the `api.postman_collection.json` into your Postman client and give it all a spin
- Go to the `/api-docs` page

# Run the app

Run `./start.sh`

## Notes

- Naturally there's plenty of bits here that probably wouldn't be done in prod, like:
    - Running Sequelize's autosync in prod
    - A proper `.env` file setup for the JWT secret instead of committing it to the repo
    - The tests would test more than the bare basics
    - Actual request validation
    - A proper commit history
- The JSDoc Swagger UI generation package used seems to have an [issue](https://github.com/BRIKEV/express-jsdoc-swagger/issues/132) with rendering example bodies properly. Ideally that would either be sorted out or a different package used for this
- Given my lack of exposure to this ecosystem, and the breadth I've decided to go for, I did heavily use AI to help me with getting this going. It was very much piece by piece for each part of the app I was building based on my requirements, not just "here's the task spec, spit out an app". In *normal* day to day work, I mostly stick to using AI for things where I know what I want the output to be, but not as well how to get there. Docker is a great example.
- I'm also not well exposed to what the standard file/directory structure in a repo like this, so generally tried to keep it simple and split somethings out into directories.

## Assignment

### Purpose
Our test is designed to be open-ended and non-prescriptive, and this is by design. We understand and appreciate that developers possess diverse sets of skills and talents, each with their own unique toolbox. Our goal is to gain insight into your individual abilities and what you consider significant in your work. We look forward to discovering your talents and skills throughout this assessment.

### Assessment Overview

Create a simple NodeJS restful application that manages users and tasks for those users.

##### Requirements
* You do NOT need to create a UI for this application - only REST endpoints.
* The application should be able to CRUD users via REST.
* The application should be able to CRUD tasks for users via REST.
* Data must be persisted to a storage mechanism (Mongo or MySql or Other).
* Use migrations to setup your database if required.


##### Bonus Task  
Setup a scheduled job to check all tasks in the Database - those that have a status of "pending" and next_execute_date_time has passed - print it to the console
and update the task to "done".


##### Evaluation Criteria
As a guide, below are the curl commands with the REST endpoints we are expecting to test against.  You can use these urls as a guideline on how to design/develop your REST endpoints.  

If you do not have access to curl, you can use the Postman chrome plugin (or any other HTTP client) to perform these calls in order to test your application.

---

##### Create user
```sh
curl -i -H "Content-Type: application/json" -X POST -d '{"username":"jsmith","first_name" : "John", "last_name" : "Smith"}' http://hostname/api/users
```

##### Update user
```
curl -i -H "Content-Type: application/json" -X PUT -d '{"first_name" : "John", "last_name" : "Doe"}' http://hostname/api/users/{id}
```

##### List all users
```sh
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/api/users
```

##### Get User info
```sh
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/api/users/{id}
```

##### Create Task
```sh
curl -i -H "Content-Type: application/json" -X POST -d '{"name":"My task","description" : "Description of task", "date_time" : "2016-05-25 14:25:00"}' http://hostname/api/users/{user_id}/tasks
```

##### Update Task
```sh
curl -i -H "Content-Type: application/json" -X PUT -d '{"name":"My updated task"}' http://hostname/api/users/{user_id}/tasks/{task_id}
```

##### Delete Task
```sh
curl -i -H "Content-Type: application/json" -X DELETE http://hostname/api/users/{user_id}/tasks/{task_id}
```

##### Get Task Info
```sh
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/api/users/{user_id}/tasks/{task_id}
```

##### List all tasks for a user

```sh
curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X GET http://hostname/api/users/{user_id}/tasks
```

