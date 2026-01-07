 ## Architecture and Design Choices

This project follows an MVC (Model–View–Controller) architecture to keep responsibilities clearly separated. While the lecture examples often placed SQL queries directly in the route handlers, I chose to structure the application using MVC principles:

- **Models** contain all SQL queries and database-related logic.
- **Controllers* handle application logic, validation, error handling (using try/catch), and prepare data for the views.
- **Routes** are kept minimal and are only responsible for routing requests to the appropriate controller methods.

The overall implementation and SQL queries are based on the techniques shown in the lectures, but reorganized into MVC structure to better reflect common Node.js application architecture.