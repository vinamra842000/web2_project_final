# Recipe Management System

## Team Members
- Hiren Lad (N01656780)
- Jolly Christy (N01650368)
- Dhruv Modi (N01649493)
- Vinamra Bhavsar (N01650344)

---

# Recipe Management System – Project Documentation

## Project Overview
The **Recipe Management System** is a web-based platform that allows users to browse, create, manage, and review recipes. It supports user registration and login, recipe creation/editing by registered users, and administrative control for managing users and recipes.  

The application includes:
- Public and private sections
- Role-based access (Admin/User)
- Viewing trending and latest recipes
- Search and filter functionality
- Commenting and rating recipes
- Admin features for monitoring activities, managing content, and moderating users

---

## Team Responsibilities

- **Jolly Christy**  
  Responsible for implementing the user authentication system (Login & Register pages).  
  - Users can sign up with their full name, email, and password.
  - Login supports email/password and guest access.
  - Manages comment and review system — users can leave feedback, rate recipes, edit, or delete personal reviews.

- **Dhruv Modi**  
  Handles the public-facing pages:  
  - **Recipe Detail Page** with recipe photo, ingredients, preparation steps, cook time, and user reviews.
  - **Search and Filter Page** to find recipes by keywords, ingredients, tags, or categories.

- **Hiren Lad**  
  In charge of recipe management for registered users:  
  - **My Recipes Page** — view, edit, or delete submitted recipes.
  - **Create Recipe Page** — add new recipe with details.
  - **Edit Recipe Page** — update existing recipes.
  - Ensures data validation and security.

- **Vinamra Bhavsar**  
  Responsible for admin functionalities:  
  - **Admin Dashboard** — overview of total users, recipes, and recent activities.
  - **User Management Page** — view/update/delete users, manage roles (e.g., promote to admin).

---

## How It Works – Live Demo Walkthrough

Explore the live app here:  
[https://web2-project-final-deploy.vercel.app/login](https://web2-project-final-deploy.vercel.app/login)

### Step 1: Register or Login
- **Register:**  
  - Enter Full Name, Email, and Password  
  - Choose Role: Admin or User  
  - Click **Register**  

- **Login with Test Credentials:**

  **Admin Account:**  
  - Email: `admin@admin.com`  
  - Password: `admin`  

  **Normal User Account:**  
  - Email: `hiren@gmail.com`  
  - Password: `hiren`  

---

### Step 2: Home Page – Explore Recipes
- View all recipes sorted by ratings
- Use the **Search Bar** to:
  - Search recipes by name
  - Filter by meal type or category

---

### Step 3: View a Recipe
- Click a recipe to view:
  - Image
  - Ingredients
  - Preparation Steps
  - Cook Time
  - User Comments & Ratings  

- If logged in as a user:
  - Leave a review
  - Submit or edit a comment
  - Rate using a star system

---

### Step 4: Manage Your Recipes (For Registered Users)
- **Create New Recipe**
  - Add title, photo, ingredients, and instructions

- **Edit or Delete Recipes**
  - Manage your recipes at any time  

---

### Step 5: Admin Dashboard (For Admins)
- View total users and recipes
- Monitor user activity
- Delete any recipe
- Manage user roles *(planned for future updates)*  

---

### Step 6: Logout
- Easily log out from the top-right menu  

---

## Important Deployment Note – Vercel Read-Only File System
> **Note:**  
> The error occurs because **Vercel’s production environment uses a read-only file system**.  
> Attempting to save files to `/public/uploads` triggers an **EROFS (Error Read-Only File System)** at runtime.  
> Functionality related image will not work in deployed project because of given reason.

---

## Summary
The **Recipe Management System** offers:
- Browsing and searching for recipes
- Creating, editing, and deleting your own recipes
- Interacting with others through reviews
- Admin moderation tools  
