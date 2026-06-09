# MealMaster - Smart Meal Subscription & Food Ordering Platform

## Project Overview

MealMaster is a full-stack web application that enables users to subscribe to meal plans, order food online, make secure payments, and receive personalized meal recommendations.

The platform provides a seamless experience for users to manage their daily meals while allowing administrators to monitor subscriptions, orders, and user activities.

---

## Features

### User Features

* User Registration & Login
* JWT-Based Authentication & Authorization
* OTP Verification
* Browse Available Meal Plans
* Subscribe to Meal Plans
* Place Food Orders
* Razorpay Payment Integration
* Order History Tracking
* Reviews & Ratings
* AI-Based Meal Recommendations
* Profile Management

### Admin Features

* Manage Users
* Manage Meal Plans
* View & Manage Orders
* Monitor Subscriptions
* Review Customer Feedback

---

## System Architecture

```text
Frontend (React.js)
        │
        ▼
REST APIs (Spring Boot)
        │
        ▼
Business Logic Layer
        │
        ▼
Spring Data JPA
        │
        ▼
MySQL Database
```

---

## Tech Stack

### Frontend

* React.js
* Bootstrap
* Axios
* JavaScript
* HTML5
* CSS3

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate

### Database

* MySQL

### Payment Gateway

* Razorpay

### Tools & Technologies

* Git
* GitHub
* Maven
* Postman

---

## Authentication Flow

1. User registers and verifies account through OTP.
2. User logs in using credentials.
3. Backend validates credentials.
4. JWT token is generated.
5. Token is attached to future requests.
6. Protected APIs are accessed only after successful authentication.

---

## Project Structure

```text
MealMaster
│
├── Frontend (React.js)
│   ├── Components
│   ├── Pages
│   ├── Services
│   └── Assets
│
├── Backend (Spring Boot)
│   ├── Controllers
│   ├── Services
│   ├── Repositories
│   ├── Entities
│   ├── Security
│   └── Configuration
│
└── Database (MySQL)
```

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/vaish-006/mealmaster_project.git
```

### Backend Setup

```bash
cd mealmaster-backend
```

Configure database properties in:

```properties
application.properties
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

### Frontend Setup

```bash
cd MealMaster
npm install
npm run dev
```

---

## API Testing

The APIs were tested using Postman to verify:

* Authentication
* User Management
* Meal Subscription
* Order Placement
* Payment Processing
* Review Management

---

## Challenges Faced

* Implementing secure JWT authentication
* Managing role-based authorization
* Integrating Razorpay payment gateway
* Handling API security and validation
* Maintaining efficient database relationships

---

## Future Enhancements

* Mobile Application Support
* Real-Time Order Tracking
* Notification System
* Advanced Analytics Dashboard
* Advanced AI-Based Nutrition Planning

---

## My Contribution

* Developed REST APIs using Spring Boot
* Implemented JWT Authentication & Authorization
* Integrated MySQL Database using Spring Data JPA
* Developed business logic for subscriptions and orders
* Integrated Razorpay Payment Gateway
* Performed API testing using Postman
* Collaborated on full-stack development and deployment

---

## Contact

**Vaishnavi Pardeshi**

* Email: [vaishnavipardeshi06@gmail.com](mailto:your-vaishnavipardeshi06@gmail.com)
* LinkedIn: www.linkedin.com/in/vaishnavi-pardeshi-641556223
* GitHub: https://github.com/Vaish-006

```
```
