# Express Boilerplate

## Guide

### Install Dependencies

```bash
npm install
```

### Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=8080

# URL of the Mongo DB
DB_HOST=mongodb://127.0.0.1:27017/express-boilerplate
```

### Project Structure

```
src\
 |--Controllers\    # Route controllers (controller layer)
 |--Database\       # Database configuration
 |--Middlewares\    # Custom express middlewares
 |--Models\         # Mongoose models (data layer)
 |--Routes\         # Routes
 |--Utils\          # Utility classes and functions
 |--Validations\    # Request data validation schemas
 |--App.js          # Express app
```

## Available Scripts

In the project directory, you can run:

### Run dev

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Start build

```bash
npm start
```

### Lint

```bash
npm run lint
```

### Prettier fix

```bash
npm run prettier:fix
```

### Prettier check

```bash
npm run prettier:check
```
