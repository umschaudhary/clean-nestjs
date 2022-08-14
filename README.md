# NestJs Template 
NestJS template

Status : On Going

## Features Included
- [X] User Model
- [X] User crud & Authentication
- [X] Mailer/Email Service Integration
- [X] Prisma
- [X] Docker
- [X] Postgresql
- [X] PgAdmin4
- [X] Redis
- [X] Swagger Integration
- [X] Security
- [X] CORS

## InProgress/Todo
- [ ] Authorization/Roles
- [ ] Pre-Git Hook to ensure code standards eg: no console.log

## Project Setup Instructions

1. Update `.env` file
2. Run project with docker
```bash 
docker-compose up 
```
3. Run migrations
```bash
docker-compose run web bash
npx prisma migrate dev
```
4. Access api running on [Localhost](http://localhost:3000)
5. Swagger docs [Link](http://localhost:3000/api)
