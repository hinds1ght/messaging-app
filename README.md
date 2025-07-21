# ChimeUwu - Real-time Messaging App

A full-stack, real-time messaging app built with **Next.js 14**, **PostgreSQL**, **Prisma**, and **Server-Sent Events (SSE)**. Authenticated users can search for others, start conversations, and exchange messages instantly.

---

## Features

- JWT-based Authentication (Access & Refresh tokens)
- User registration, login, and search
- Real-time messaging using Server-Sent Events (SSE)
- Persistent conversations and messages via PostgreSQL + Prisma
- Emoji picker support
- Responsive design (**mobile in-development**)
- Live "sending…" indicators for messages in-flight

---

## Tech Stack

- **Frontend & Backend**: [Next.js 14](https://nextjs.org/)
- **Database**: PostgreSQL (local + Render for production)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: Custom JWT + AuthContext
- **Realtime Messaging**: Server-Sent Events (SSE)
- **Styling**: Tailwind CSS
- **Emoji Support**: [`emoji-picker-react`](https://github.com/ealush/emoji-picker-react)

---

## Deployment

- Frontend: Vercel
- Database: Render PostgreSQL

---

## Live Demo

- view live demo [here](https://messaging-app-henna-kappa.vercel.app/)

---

## Demo Accounts

- Email: alice@example.com / Password: alice123

- Email: bob@example.com / Password: bob123

---

## Future Improvements

- File uploads (images, PDFs, etc.)

- Message reactions (👍, 😂, etc.)

- Typing indicators via SSE

- Push notifications

- Admin dashboard

---

## Author

- GitHub: [@hinds1ght](https://github.com/hinds1ght)
- Email: gilyu619@gmail.com
