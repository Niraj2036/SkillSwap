# 🎯 Skill Swap Platform

A collaborative platform where users can **exchange skills** with each other by offering what they know and requesting what they want to learn.

---

## 📘 Overview

The **Skill Swap Platform** is a mini-application that facilitates **peer-to-peer learning** by enabling users to:

- Showcase the skills they offer
- Indicate the skills they wish to learn
- Request swaps from other users with compatible skills
- Rate and provide feedback after each skill exchange

This encourages **community-driven knowledge sharing** in a structured yet flexible way.

---

## 🧩 Core Features

### 🧑 User Profile

- **Basic Details**: Name, Email, Location (optional), Profile Photo (optional)
- **Skills Offered**: Users can list skills they are willing to teach/share
- **Skills Wanted**: Users can list skills they want to learn
- **Availability**: String array (e.g., "Evenings", "Weekends")
- **Profile Visibility**: Public or Private toggle
- **Google Authentication**: Secure login using Google OAuth

### 🔍 Skill Discovery

- Search or filter users based on **skills offered/wanted**
- Filter based on **availability match**

### 🔁 Swap Requests

- Request a swap by selecting a skill you want and matching it with a skill you offer
- Accept or reject incoming swap requests
- View pending and active swaps
- Delete a request if it hasn’t been accepted

### ⭐ Feedback System

- Users can leave a **rating (1–5)** and written **feedback** after a swap

### 🔔 Notifications

- Get notified when a request is **accepted**, **rejected**, or **updated**

---

## 💻 Tech Stack

| Layer      | Technology             |
|------------|------------------------|
| Frontend   | **React + ShadCN UI**  |
| Backend    | **NestJS (TypeScript)**|
| Database   | **PostgreSQL + Prisma**|
| Auth       | **Google OAuth**       |
| UI Library | **ShadCN (Radix UI + Tailwind)** |
| Deployment | Can be hosted on **Vercel**, **Railway**, **Render**, etc. |

---

## 📐 Database Design

🔗 **ER Diagram**:  
[Click to View on Eraser](https://app.eraser.io/workspace/BHY18c81w40d6fc4xLFd)

Our schema includes the following core models:

- `User`
- `Skill`
- `UserOfferedSkill`
- `UserWantedSkill`
- `SwapRequest`
- `SwapFeedback`
- `OTP` (for email auth/verification)

Designed with **Prisma ORM** and **PostgreSQL**, following normalized relational structure.

---

## 🚀 Future Enhancements

We aim to introduce the following features in the upcoming releases:

- 💬 In-app chat between users
- 📝 Skill endorsements by peers
- 📅 Swap scheduling and calendar sync
- 📈 User analytics and performance tracking
- 📣 Public swap boards or campaigns

---
