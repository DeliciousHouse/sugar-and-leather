Sugar and Leather marketing site built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Getting Started

Install dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the site.

## Production build

```bash
npm run build
npm run start
```

## Docker

Build the image:

```bash
docker build -t sugar-and-leather .
```

Run the container:

```bash
docker run -p 3000:3000 sugar-and-leather
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Notes

- Contact form posts to `/api/contact` and logs submissions server-side.
- Content is hardcoded for easy iteration.
