# BudgetApp

Simple budget app designed to allow you to set budgets for each month and also categorize your spendings.

![Screenshot 2024-02-22 233325](https://github.com/burgerax5/BudgetApp/assets/93895662/246e4d3a-038c-410d-b97c-ec446592cc27)

The user is able to view all their expenses in a table and can filter their expenses by date, category, and name.

![Screenshot 2024-02-23 113849](https://github.com/burgerax5/BudgetApp/assets/93895662/ad6670ce-c852-4aee-9f34-f353c1299e80)

I have implemented a simple authentication system, which makes use of JWTs. 

![authentication](https://github.com/burgerax5/BudgetApp/assets/93895662/9f2a4269-b383-4c55-aed5-0a136988a65f)

Optionally, the user can also enable 2FA for their account.

![2fa](https://github.com/burgerax5/BudgetApp/assets/93895662/21a25528-7af1-4e99-892c-4a1c8eb800f3)


## Backend Setup

1. Create a new `.env` file under /src containing:

```plaintext
PORT=<PORT_NUMBER>
ACCESS_TOKEN_SECRET="<INSERT_ACCESS_TOKEN_SECRET>"
REFRESH_TOKEN_SECRET="<INSERT_REFRESH_TOKEN_SECRET>"
DATABASE_URL="mongodb+srv://[username:password@]host[/[defaultauthdb][?options]]"
```
Under /src/database, perform the following:
```bash
npx prisma generate
npx prisma migrate deploy
```
Perform these whenever you want to change databases or when you update the schema.

## Running the App
In order to run the app, first install any dependencies the run:
```bash
npm i 
npm run start
```

## Frontend Setup
Similar to the backend, install the dependencies then run:
```bash
npm i
npm run dev
```

