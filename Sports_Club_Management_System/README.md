# Sports Club Management System

A beginner-friendly full-stack project using Node.js, Express, MongoDB Atlas, HTML, CSS and JavaScript.

## Features
- Dashboard counts for members and training activities
- Add and remove club members
- Add and remove training activities
- MongoDB Atlas persistence
- Responsive layout

## Requirements
Install Node.js (LTS) and VS Code. Create a MongoDB Atlas database and obtain its connection string.

## Run locally
1. Open this project folder in VS Code.
2. Open Terminal > New Terminal.
3. Run `npm install`.
4. Copy `.env.example` to a new file named `.env`.
5. Replace the example `MONGODB_URI` with your real MongoDB Atlas connection string. URL-encode special characters in the database password.
6. In MongoDB Atlas, add your current IP address under Network Access and create a database user under Database Access.
7. Run `npm start`.
8. Open `http://localhost:3000` in your browser.

## Deploy on Render
1. Push this folder to a GitHub repository.
2. In Render, choose New > Web Service and connect that GitHub repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Under Environment, add `MONGODB_URI` with the same Atlas connection string. Add `NODE_ENV` = `production` if desired.
6. Deploy and open the Render URL.

For a quick academic demo, configure Atlas Network Access appropriately. For a real production service, restrict network access where practical, add authentication and role-based authorization, validate inputs more thoroughly, use HTTPS, backups, logging and privacy safeguards. This starter app does not include login or role-based access control and should not be used to store sensitive personal information.

## GitHub commands
```bash
git init
git add .
git commit -m "Initial sports club management system"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
If the repository already has a remote, check it with `git remote -v` instead of adding a second remote.
