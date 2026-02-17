# 🏥 Mini EMR & Patient Portal Application

A full-stack healthcare management application built with **Next.js 14**, featuring an **Admin EMR interface** and a **Patient Portal** with authentication.

---

## 🚀 Tech Stack

- Next.js 14 with TypeScript
- Prisma ORM
- SQLite (Development Database)
- Tailwind CSS
- Cookie-based Authentication

---

## ✨ Features

### 🔹 1. Mini EMR (Admin Interface)

**Route:** `/admin`  
**Authentication:** Not required

#### 👥 Patient Management
- View all patients in a table
- See total appointments count
- See total prescriptions count
- Create new patients (with password setup)
- View detailed patient profile

#### 📅 Appointments (Full CRUD)
- Create appointments
- View appointments
- Update appointments
- Delete appointments
- Support for recurring schedules
- End dates for recurring appointments

#### 💊 Prescriptions (Full CRUD)
- Medication name
- Dosage
- Quantity
- Refill schedule tracking

---

### 🔹 2. Patient Portal

**Route:** `/`

#### 🔐 Authentication
- Email and password login
- Cookie-based session handling
- Logout functionality

#### 📊 Dashboard
Shows:
- Patient profile information
- Appointments within next **7 days**
- Medication refills within next **7 days**

#### 📆 Additional Pages
- View all appointments (next **3 months**)
- View all prescriptions (next **3 months**)
a
Just:

1. Open your project in VS Code  
2. Create a new file named `README.md`  
3. Paste this content  
4. Save the file  

Done ✅

---

## 🛠 Installation & Setup

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Setup Database
```bash
npx prisma db push
```

### 3️⃣ Seed Database
```bash 
npm run db:seed
```

### 4️⃣ Run Development Server
```bash 
npm run dev
```
# 🌐 Access Application

### Patient Portal:
http://localhost:3000

### Admin EMR:
http://localhost:3000/admin

# 🧪 Demo Credentials
##### Email:  john.doe@example.com
##### Password:
 password123