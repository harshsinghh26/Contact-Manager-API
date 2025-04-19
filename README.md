# 📇 ContactVault API

A secure and easy-to-use RESTful API for managing personal and professional contacts, with user-based authentication. Built using **Node.js**, **Express**, and **MongoDB**.

---

## 📁 Project Features

- User Registration & Login with JWT Auth
- Create, Read, Update, and Delete Contacts
- Contacts are user-specific and private
- Optional fields: email, phone, address, favorite status
- Contact search by name, email, or phone
- RESTful API structure with proper error handling

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB with Mongoose  
- **Auth:** JWT (JSON Web Token)  
- **Deployment:** Render / Railway / Cyclic  

---

## 📦 Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/harshsingh26/ContactVault-API.git
   cd ContactVault-API
   
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   PORT=8000
   DB_URL=your_mongodb_connection_string
   CORS = your_cors_url
   ACCESS_TOKEN_SECRET = your_secret_key
   ACCESS_TOKEN_EXPIRY = set expiry
   REFRESH_TOKEN_SECRET = your_secret_key
   REFRESH_TOKEN_EXPIRY = set_expiry
   CLOUDINARY_CLOUD_NAME = set your cloud name
   CLOUDINARY_API_KEY = set cloudinary api key
   CLOUDINARY_API_SECRET = your cloudinary api secret
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

🔌 API Endpoints
🔐 Authentication
- **POST** `/api/v1/users/register` - Register a new user
- **POST** `/api/v1/users/login` - Login with email and password
- **POST** `/api/v1/users/logout` - Logout Current User

📇 Contacts

- **POST** `/api/v1/contacts/creat-contact` - Create Contacts
- **GET** `/api/v1/contacts/get-contacts` - Get Contacts
- **GET** `/api/v1/contacts/get-contacts/:id` - Get Contacts By Id
- **PATCH** `/api/v1/contacts/update/:id` - Update Contacts Details
- **PATCH** `/api/v1/contacts/update-avatar/:id` - Update Contacts Avatar
- **PATCH** `/api/v1/contacts/delete/:id` - Delete Contacts

## Testing
Use **Postman** or any API client to test the endpoints.
