# SPA React - Prueba Técnica

## 🚀 Descripción

Aplicación SPA construida con React, que incluye:

- Autenticación y control de sesión por roles (admin/usuario)
- Gestión de usuarios y datos relacionados (estudios, direcciones)
- Context API + sessionStorage
- API simulada (mock)
- Diseño responsive con React Bootstrap

## 🔐 Roles

- **Admin:** puede ver, crear y gestionar todos los usuarios y sus datos.
- **Usuario:** puede ver y editar solo su propio perfil y datos relacionados.

## 📦 Tecnologías

- React
- React Router DOM
- React Bootstrap
- Context API
- Axios

## 💻 Instalación local

```bash
npm install
npm run dev # o npm start si usás Create React App
```

## 🌐 Deploy

**URL de la app:** [https://mi-app.vercel.app](https://mi-app.vercel.app)

## 🧪 Usuarios de prueba

```
Admin:
  Email: admin@test.com
  Password: cualquier valor

Usuario normal:
  Email: alice@test.com
  Password: cualquier valor
```

## ⚙️ Variables de entorno (si se usan)

Ninguna requerida para esta versión mockeada. Todo funciona sin backend real.

## 🗃️ Estructura destacada

```
src/
├── App.js
├── contexts/
│   └── AuthContext.js
├── pages/
│   ├── LoginPage.js
│   ├── Dashboard.js
│   ├── AdminDashboard.js
│   ├── UserProfile.js
├── components/
│   ├── UserDataManager.js
│   ├── AdminUserDataManager.js
│   └── UserDataForm.js
└── mockService.js
```
