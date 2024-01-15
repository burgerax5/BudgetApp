# BudgetApp

Simple budget app designed to allow you to set budgets for each month and also categorize your spendings.

## Backend Setup

1. Create a new `.env` file under /src containing:

```plaintext
PORT=<PORT_NUMBER>
ACCESS_TOKEN_SECRET="<INSERT_ACCESS_TOKEN_SECRET>"
REFRESH_TOKEN_SECRET="<INSERT_REFRESH_TOKEN_SECRET>"

TEST_DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mytestdatabase"
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase"
```
Under /src/database, perform the following:
```bash
npx prisma generate
npx migrate deploy
```
Perform these whenever you want to change databases or when you update the schema.

## Running the App
In order to run the app:
```bash
npm run start
```

## Unit Tests
To run unit tests (Note: Some tests may be flaky, handle with caution):
```bash
npm run test
```
