# 🚀 Proyecto Nuxt 3 con Autenticación GitHub + JWT

Este proyecto está construido con **Nuxt 3** y utiliza:

-   🔥 Nuxt 3 (Server Routes + Nitro)
-   🐙 Autenticación OAuth con GitHub
-   🛢️ Drizzle ORM
-   🗄️ Base de datos SQLite (carpeta `.data`)
-   🔐 JWT (JSON Web Token) almacenado en cookie httpOnly
-   🧠 jose para firmar y verificar tokens

------------------------------------------------------------------------

## 📦 Tecnologías utilizadas

-   Nuxt 3
-   TypeScript
-   Drizzle ORM
-   drizzle-kit
-   GitHub OAuth
-   jose (JWT)
-   h3 (cookies y server utils)

------------------------------------------------------------------------

## 🔐 Autenticación

El flujo de autenticación funciona así:

1.  El usuario inicia sesión con GitHub.
2.  Se verifica si el usuario existe en la base de datos.
3.  Si no existe, se crea automáticamente.
4.  Se genera un JWT con:
    -   id
    -   email
    -   role
5.  El JWT se guarda en una cookie segura (`httpOnly`).
6.  Los endpoints protegidos usan `requireUserSession()` para validar
    sesión.

------------------------------------------------------------------------

## 🛠️ Instalación y configuración

### 1️⃣ Instalar dependencias

``` bash
npm install
```

------------------------------------------------------------------------

### 2️⃣ Crear carpeta de base de datos

``` bash
mkdir .data
```

------------------------------------------------------------------------

### 3️⃣ Ejecutar migraciones con Drizzle

``` bash
npx drizzle-kit push
```

Esto creará las tablas necesarias en la base de datos.

------------------------------------------------------------------------

### 4️⃣ Crear archivo `.env`

Debes crear un archivo `.env` en la raíz del proyecto con:

    GITHUB_CLIENT_ID=tu_client_id
    GITHUB_CLIENT_SECRET=tu_client_secret
    JWT_SECRET=tu_super_secreto_jwt

⚠️ Estas claves las obtienes creando una OAuth App en GitHub.

------------------------------------------------------------------------

## ▶️ Ejecutar el proyecto

``` bash
npm run dev
```

El proyecto estará disponible en:

    http://localhost:3000

------------------------------------------------------------------------

## 🧩 Estructura importante

    server/
     ├── api/
     ├── utils/session.ts   # requireUserSession

------------------------------------------------------------------------

## 🔒 Seguridad

-   El JWT se almacena en cookie `httpOnly`
-   Expira en 2 horas
-   Los endpoints verifican el token antes de responder

------------------------------------------------------------------------

## 📌 Notas

-   Asegúrate de tener Node.js 18+
-   En producción usa siempre variables de entorno seguras
-   Nunca subas tu `.env` al repositorio

------------------------------------------------------------------------

Hecho con ❤️ usando Nuxt 3
