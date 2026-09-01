# 💬 Chattrix

Chattrix is a modern and responsive social networking platform where users can connect, share posts, interact through likes and comments, follow other users, and build their social circle.

---

## 🌐 Live Demo

🚀 **Visit Chattrix here:**

https://chattrix-588q.onrender.com

> Replace the above link with your actual Render deployment URL if it is different.

---

## 🚀 Features

### 👤 User Authentication

- User Registration
- User Login
- Secure Password Hashing
- Session-Based Authentication
- User Logout

### 📝 Posts

- Create Posts
- Share Captions
- Add Images Using Image URLs
- Edit Posts
- Delete Posts
- View Posts

### ❤️ Social Interactions

- Like and Unlike Posts
- Comment on Posts
- View Comments

### 👥 Follow System

- Follow Users
- Unfollow Users
- View Followers
- View Following

### 👤 User Profiles

- View User Profiles
- Profile Avatar
- User Posts
- Followers Count
- Following Count

### 🎨 Modern UI

- Modern Dark Theme
- Responsive Design
- Attractive Social Media Interface
- Glassmorphism Effects
- Mobile-Friendly Layout

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- EJS
- Font Awesome

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication & Security

- Express Session
- bcryptjs
- dotenv
- connect-flash

---

## 📁 Project Structure

```text
Chattrix/
│
├── controllers/
│   ├── authController.js
│   ├── postController.js
│   ├── userController.js
│   └── followController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
│
├── routes/
│   ├── authRoutes.js
│   ├── postRoutes.js
│   ├── userRoutes.js
│   └── followRoutes.js
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   ├── images/
│   │
│   └── js/
│
├── views/
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   │
│   ├── partials/
│   │   ├── navbar.ejs
│   │   └── footer.ejs
│   │
│   ├── index.ejs
│   ├── home.ejs
│   └── ...
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

## ⚙️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ShrishailChincholi/Chattrix
```

### 2️⃣ Navigate to the Project

```bash
cd Chattrix
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Create a `.env` File

Create a `.env` file in the root directory of your project:

```env
MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your_secret_key
PORT=5000
```

### 5️⃣ Run the Application

#### For Development

```bash
npm run dev
```

#### For Production

```bash
npm start
```

After starting the application, open:

```text
http://localhost:5000
```

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `SESSION_SECRET` | Secret key used for authentication sessions |
| `PORT` | Application server port |

---

## 🌍 Deployment

The application can be deployed using **Render**.

### Render Configuration

```text
Build Command: npm install

Start Command: npm start
```

### Environment Variables on Render

```env
MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your_secret_key
```

> Do not upload your `.env` file to GitHub.


```

---

## 🎯 Future Improvements

- 💬 Real-Time Chat System
- 🔔 Notification System
- 📸 Image Upload Using Cloudinary
- 🔍 Advanced User Search
- ❤️ Improved Social Interactions
- 🌙 Multiple Theme Support
- 📱 Progressive Web App
- 🤖 AI Content Suggestions

---

## 👨‍💻 Author

**Shrishail Chincholi**

- GitHub: https://github.com/ShrishailChincholi

---

## ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub!

---

### 💬 Built with ❤️ using Node.js, Express.js, EJS, and MongoDB Atlas