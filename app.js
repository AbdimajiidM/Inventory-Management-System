const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError')
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean")

const globalErrorHandler = require('./controllers/errorController')

const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes")
const companyInfoRoutes = require("./routes/companyInfoRoutes")
const productRoutes = require("./routes/productRoutes")
const customerRoutes = require("./routes/customerRoutes");
const vendorRoutes = require("./routes/vendorRoutes")
const saleRoutes = require("./routes/saleRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes")
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes")
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000'
}));

// 1) MIDDLEWARES

// Set security HTTP Headers
app.use(helmet())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10kb' }));


// Data sanitization against NoSQl query injection
app.use(mongoSanitize());

// Data sanitization agins xss
app.use(xss())

// 3) ROUTES

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/companyInfo', companyInfoRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/customers', customerRoutes)
app.use('/api/v1/vendors', vendorRoutes)
app.use('/api/v1/sales', saleRoutes);
app.use("/api/v1/purchases", purchaseRoutes);
app.use("/api/v1/transactions", transactionRoutes)
app.use('/api/v1/dashboard', dashboardRoutes)

app.all('*', (req, res, next) => {
  next(new AppError(`cant't found ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
