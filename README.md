# NestJs Template 
NestJS template

Status : In Progress

## Completed
- [X] User Model
- [X] User crud & Authentication
- [X] Mailer/Email Service Integration
- [X] Prisma
- [X] Docker
- [X] Postgresql
- [X] PgAdmin4
- [X] Redis

## InProgress/Todo
- [ ] Authorization
- [ ] Swagger Integration
- [ ] Security

## Instructions

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
4. API running on [Localhost](http://localhost:3000)
