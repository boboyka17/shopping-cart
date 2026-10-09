# Shopping Cart

ระบบตะกร้าสินค้าแบบ Full Stack ประกอบด้วย Frontend (Next.js), Backend (.NET 10 Web API) และฐานข้อมูล PostgreSQL รันทั้งหมดด้วย Docker Compose

## โครงสร้างโปรเจกต์

```
.
├── docker-compose.yml
├── client/
│   └── shopping-cart/     # Frontend (Next.js + Tailwind + daisyUI)
└── server/
    └── Api/               # Backend (.NET 10 + EF Core + Npgsql)
```

## เทคโนโลยีที่ใช้

| ส่วน     | เทคโนโลยี                                                        |
| -------- | ---------------------------------------------------------------- |
| Frontend | Next.js, React, Tailwind CSS, daisyUI, Heroicons, Zustand, Axios |
| Backend  | .NET 10, ASP.NET Core, Entity Framework Core                     |
| Database | PostgreSQL 16                                                    |
| Infra    | Docker, Docker Compose                                           |

## สิ่งที่ต้องมี

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (หรือ Docker Engine + Compose v2)
- พอร์ตที่ต้องว่าง: `3000`, `5050`, `5432`

สำหรับรันแบบไม่ใช้ Docker (ทางเลือก):

- Node.js 20+
- .NET SDK 10
- PostgreSQL 16

## วิธีรันด้วย Docker (แนะนำ)

### 1. Clone โปรเจกต์

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Build และรันทุก service

```bash
docker compose up --build -d
```

ครั้งแรกจะใช้เวลาสักครู่ เพราะต้องดึง image และ build โปรเจกต์

### 3. เปิดใช้งาน

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:3000 |
| Backend API | http://localhost:5050 |
| PostgreSQL  | localhost:5432        |

ตารางในฐานข้อมูลจะถูกสร้างอัตโนมัติ (EF Core Migration) ตอน backend เริ่มทำงาน

## คำสั่งที่ใช้บ่อย

```bash
# ดูสถานะ container
docker compose ps

# ดู log ทั้งหมด / เฉพาะ service
docker compose logs -f
docker compose logs -f backend

# หยุดระบบ
docker compose down

# หยุดและล้างข้อมูลฐานข้อมูลทั้งหมด
docker compose down -v

# Build ใหม่เฉพาะ service
docker compose build frontend --no-cache
docker compose up -d
```

## การตั้งค่า

### Environment Variables

| ตัวแปร                            | Service              | ค่าเริ่มต้น               | คำอธิบาย                        |
| --------------------------------- | -------------------- | ------------------------- | ------------------------------- |
| `POSTGRES_DB`                     | db                   | `thanachart`              | ชื่อฐานข้อมูล                   |
| `POSTGRES_USER`                   | db                   | `postgres`                | ผู้ใช้ฐานข้อมูล                 |
| `POSTGRES_PASSWORD`               | db                   | `P@ssw0rd`                | รหัสผ่านฐานข้อมูล               |
| `ConnectionStrings__DbConnection` | backend              | `Server=db;Port=5432;...` | Connection string ของ backend   |
| `NEXT_PUBLIC_API_URL`             | frontend (build arg) | `http://localhost:5050`   | URL ของ API ที่เบราว์เซอร์เรียก |

> **สำคัญ:** `NEXT_PUBLIC_API_URL` ถูกฝังตอน build เท่านั้น หากแก้ค่านี้ต้องรัน `docker compose up --build` ใหม่

### เปลี่ยนพอร์ต

แก้ใน `docker-compose.yml` (ตัวเลขซ้ายมือของ `:` คือพอร์ตบนเครื่อง):

```yaml
backend:
  ports:
    - "5050:8080"
```

หากเปลี่ยนพอร์ต backend ต้องแก้ `NEXT_PUBLIC_API_URL` ให้ตรงกันด้วย

## วิธีรันแบบไม่ใช้ Docker (สำหรับพัฒนา)

### 1. เปิดฐานข้อมูล

รันเฉพาะ PostgreSQL ด้วย Docker:

```bash
docker compose up -d db
```

### 2. รัน Backend

```bash
cd server/Api
dotnet restore
dotnet run
```

Backend จะอ่าน connection string จาก `appsettings.json` (`Server=localhost;...`) และ migrate ฐานข้อมูลอัตโนมัติ

### 3. รัน Frontend

สร้างไฟล์ `client/shopping-cart/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:<พอร์ตที่ backend รันอยู่>
```

จากนั้น:

```bash
cd client/shopping-cart
npm install
npm run dev
```

เปิด http://localhost:3000

## ฟีเจอร์

- แสดงรายการสินค้า พร้อมสถานะสต็อก (หมด / เหลือน้อย)
- เพิ่ม ลด ลบสินค้าในตะกร้า
- สรุปยอดรวมคำสั่งซื้อ
- ชำระเงินผ่าน QR Code (แบบจำลอง)

## หมายเหตุด้านความปลอดภัย

- รหัสผ่านใน `docker-compose.yml` ใช้สำหรับการพัฒนาเท่านั้น หากนำขึ้น production ควรย้ายไปไฟล์ `.env` (เพิ่มใน `.gitignore`) และอ้างด้วย `${DB_PASSWORD}`
- หน้าชำระเงินเป็นแบบจำลอง (dummy) ยังไม่ได้เชื่อมต่อระบบชำระเงินจริง
- ควรตั้ง `ASPNETCORE_ENVIRONMENT=Production` เมื่อ deploy จริง
