# Hospital Information System (HIS) Patient Portal

A comprehensive Next.js and Oracle DB-powered Healthcare Management System featuring a modern patient portal. It offers real-time access to medical records, prescriptions, lab results, vitals, and surgical history with an intuitive gradient UI.

## 🌟 Overview

The Hospital Information System (HIS) Patient Portal is a full-stack web application designed to empower patients with seamless access to their healthcare data. Built with a robust technology stack, it ensures secure, high-performance data retrieval directly from an Oracle Database while delivering an exceptional user experience with dynamic, responsive design.

## ✨ Key Features

- **Personalized Dashboard**: View health summaries, assigned doctors, and at-a-glance metrics for prescriptions, labs, and vitals.
- **Prescription Tracking**: Monitor active and completed prescriptions, complete with dosage instructions, refill limits, and doctor notes.
- **Laboratory Results**: Track pending and completed lab tests, ailment details, and specific results with intuitive status badges.
- **Vital Signs Monitoring**: Keep track of key health metrics like blood pressure, heart rate, temperature, and oxygen saturation over time.
- **Surgical History**: Access records of past surgeries, surgeon details, and post-operative notes securely.
- **Comprehensive Medical Records**: View a unified timeline of diagnoses, treatment plans, and medical history.

## 🛠️ Technology Stack

- **Frontend Framework**: [Next.js](https://nextjs.org) (App Router, Server & Client Components)
- **UI Library**: React, [shadcn/ui](https://ui.shadcn.com/), Tailwind CSS
- **Database**: Oracle DB (using the `oracledb` Node.js driver)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Oracle Database (e.g., Oracle XE or Autonomous Database)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Oracle Database credentials and JWT secrets:
   ```env
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_CONNECTION_STRING=localhost:1521/XEPDB1
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🛡️ Security Note

Sensitive data such as `.env` files, Oracle connection details, and JWT secrets are ignored via `.gitignore` to prevent accidental exposure.
