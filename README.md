# Inventory-Management-System
# REST API
* Backend default port: 3000
* Base address: http://<HOST_NAME>:3000/api/v1/
* Route Categories:
    * /products - Product Management related routes
        * / - Get All Products **GET**
        * / - Craete Product **POST**
        * /:id - Get Product **GET**
        * /:id - Update Product **PATCH**
        * /:id - Delete Product **DELETE**
    * /customers - Customer Management related routes
        * / - Get All Customers **GET**
        * / - Craete Customer **POST**
        * /:id - Get Customer **GET**
        * /:id - Update Customer **PATCH**
    * /sales - Sale Management related routes
        * / - Get All Sales **GET**
        * / - Craete Sale **POST**
        * /:id - Get Sale **GET**
        * /:id - Update Sale **PATCH**
        * /:id - Delete Sale **DELETE**   
    * /transactions - Transaction Management related routes
        * / - Get All Transactions **GET**
        * / - Craete Transaction **POST**
        * /:id - Get Transaction **GET**
        * /:id - Update Transaction **PATCH**
    * /employees - Employee Management Related Routes
        * / - Get All Employees **GET**
        * / - Create Employee **POST**
        * /:id - Get Employee **GET**
        * /:id - Update Employee **PATCH**
        * /:id - Delete Employee **DELETE**
    * /users - User Management Related Routes
        * / - Get All Users **GET**
        * / - Create User **POST**
        * /:id - Get User **GET**
        * /:id - Update User **PATCH**
        * /:id - Delete User **DELETE**
        * /authenticate/ - authenticate user **GET**
     
