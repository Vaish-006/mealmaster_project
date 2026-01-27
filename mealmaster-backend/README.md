# MealMaster Backend

Spring Boot backend for MealMaster application with MySQL database.

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

### Database Setup
1. Create MySQL database:
```sql
CREATE DATABASE mealmaster;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Running the Application
1. Navigate to project directory:
```bash
cd mealmaster-backend
```

2. Run the application:
```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:9090/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/{id}` - Get subscription by ID
- `POST /api/subscriptions` - Create subscription (requires auth)
- `PUT /api/subscriptions/{id}` - Update subscription (requires auth)
- `DELETE /api/subscriptions/{id}` - Delete subscription (requires auth)

## Database Schema

The application will automatically create the following tables:
- `users` - User information with roles (User, Vendor, Admin)
- `subscriptions` - Meal subscription plans with pricing and meal details