# Social App

A modern social networking application built with cutting-edge technologies.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [License](#license)

## Tech Stack

### Backend
- Nest.js (Node.js framework)
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
  - `api/`: The Nest.js API
  - `web/`: The Next.js web application
- `packages/`: Shared packages and configurations
  - `ui/`: Shared UI components
  - `database/`: Shared Prisma schema and migrations
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
   Create `.env` files in the following directories:
   - `apps/api/.env`
   - `packages/database/.env`

   Copy the contents from `.env.example` and fill in the values.

4. **Set up Prisma:**
   ```bash
   yarn db:migrate:dev
   yarn db:seed
   ```

5. **Run the development server:**
   ```bash
   yarn dev
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.