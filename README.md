# Social App

A modern social networking application built with cutting-edge technologies.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [License](#license)

## Tech Stack

### Backend
- NestJS (Node.js framework)
- Redis (for caching)
- PostgreSQL (database)
- Prisma (ORM)

### Frontend
- Next.js (React framework)
- Tailwind CSS

### Development
- Turborepo (monorepo build system)
- Yarn (package manager)

## Project Structure

This project is set up as a monorepo using Turborepo and Yarn workspaces. The main directories are:

- `apps/`: Contains the main applications
  - `api/`: The NestJS API
  - `web/`: The Next.js web application
- `packages/`: Shared packages and configurations
  - `ui/`: Shared UI components
  - `prisma/`: Shared Prisma schema and migrations
  - `config-tailwind/`: Shared Tailwind configuration
  - `config-eslint/`: Shared ESLint configurations
  - `config-prettier/`: Shared Prettier configuration
  - `config-tsconfig/`: Shared TypeScript configurations

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kafeindev/social-app.git
   cd social-app
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add necessary environment variables. (See `.env.example` for required variables)

4. **Set up Prisma:**
   ```bash
   yarn generate
   yarn db:push
   yarn db:migrate:deploy
   ```

5. **Run the development server:**
   ```bash
   yarn dev
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.