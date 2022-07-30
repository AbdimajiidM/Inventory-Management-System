const Customer = require("../models/customerModel");
const Employee = require("../models/employeeModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Vendor = require("../models/vendorModel");

const catchAsync = require("../utils/catchAsync");

exports.defaultDashboard = catchAsync(async (req, res, next) => {
  const customers = await Customer.find().populate("transactions");
  const vendors = await Vendor.find().populate("transactions");
  const employees = await Employee.count();
  const users = await User.count();
  const products = await Product.find().where("quantity").gte(0);

  const recievable = generateTotal(customers);

  const payable = generateTotal(vendors);

  const inventory = generateTotal(products, "total");

  console.log(recievable);
  res.status(200).json({
    message: "Sucess",
    data: [
      { label: "Customers", value: customers.length, isMoney: false },
      { label: "Recievable", value: recievable, isMoney: true },
      { label: "Vendors", value: vendors.length, isMoney: false },
      { label: "Payable", value: payable, isMoney: true },
      { label: "Inventory", value: inventory, isMoney: true },
      { label: "Employee", value: employees, isMoney: false },
      { label: "Users", value: users, isMoney: false },
    ],
  });
});

const generateTotal = (list, field = "balance") => {
  let total = 0;

  for (let index = 0; index < list.length; index++) {
    const element = list[index];

    if (element[field]) {
      total += element[field];
    }
  }

  return total;
};
