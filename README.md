# Art Gallery

> A web application where artists can share their artwork, like and comment on posts, and browse other users' profiles.
> [Live Demo](https://art-gallery-m67w.onrender.com/) | [GitHub](https://github.com/Xenopus19/art-gallery)

## Preview

![App Screenshot](https://pub-60cd64ced4114249a48748e7d8de4393.r2.dev/art-demo.png)

## Features

* **Authentication:** User registration (with avatar upload) and login using JWT.
* **Art Posts:** Create and delete posts with images, with an infinite-scrolling feed on the main page.
* **Likes & Comments:** Like posts, comment on them, and view all posts you have liked.
* **User Profiles:** Browse the list of users, view their posts, and edit your own profile description.
* **Image Uploads:** Images are uploaded directly from the browser to Cloudflare R2 using presigned URLs.
* **Type-safe API:** End-to-end typed communication between client and server via tRPC.
* **Responsive Design:** User interface built with Tailwind CSS and shadcn/ui.

## Tech Stack

**Client:** React, TypeScript, Vite, Redux Toolkit, React Router, tRPC + React Query, React Hook Form, Zod, Tailwind CSS, shadcn/ui  
**Server:** Node.js, Express, tRPC, Sequelize, Umzug (migrations), JWT, bcrypt, Zod, AWS S3 client (Cloudflare R2)  
**Database:** PostgreSQL  
**DevOps & Tools:** GitHub Actions, ESLint, Render

## Environment Variables

To run this project, you will need to add the following environment variables to a `.env` file in the repository root.

- `PORT` - The port your server will run on (default is 3001)
- `DATABASE_URL` - Connection string for your PostgreSQL database
- `JWT_SECRET` - Secret key for JSON Web Token generation and validation
- `CLOUDFLARE_ACCOUNT_ID` - The Cloudflare R2 S3 endpoint URL (for example, `https://<account-id>.r2.cloudflarestorage.com`)
- `R2_ACCESS_KEY_ID` - Cloudflare R2 storage access key
- `R2_SECRET_ACCESS_KEY` - Cloudflare R2 storage secret access key

Uploads go to a Cloudflare R2 bucket named `art-gallery` (set in `src/utils/s3.ts`). The bucket needs a CORS policy that allows `PUT` requests from your frontend origin.

### Frontend environment variables

The Vite client uses these variables to connect to the API and the public image bucket:

- `VITE_BACKEND_URL` - tRPC endpoint URL (for example, `http://localhost:3001/trpc`)
- `VITE_BUCKET_URL` - Public base URL for uploaded images in the R2 bucket

For local development, put these in `client/.env.local` because Vite runs from the `client` directory. Vite embeds `VITE_*` values in the client bundle, so do not put secrets in them.

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20.19+ or v22.12+)
- [Git](https://git-scm.com/)
- A [PostgreSQL](https://www.postgresql.org/) database
- A [Cloudflare R2](https://developers.cloudflare.com/r2/) bucket

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Xenopus19/art-gallery.git
   cd art-gallery
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Create a `.env` file in the project root with the variables described above.

4. Create `client/.env.local` with the frontend settings:
   ```env
   VITE_BACKEND_URL=http://localhost:3001/trpc
   VITE_BUCKET_URL=https://your-public-bucket-domain
   ```

### Running Locally

Start the backend (http://localhost:3001) and the Vite frontend (http://localhost:5173) together from the project root:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:server   # backend
npm run dev:client   # frontend
```

### Production Build

Build the server and the client, then start the server, which also serves the built client from `client/dist`:

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yaml`) installs dependencies, lints, and builds on every push and pull request to `main`. Pushes to `main` trigger a deployment on Render and bump the version tag (include `#skip` in the commit message to skip both).
