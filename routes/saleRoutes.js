const express = require('express');
const saleController = require('./../controllers/saleController');

const router = express.Router();

router.route('/bydate/:startDate/:endDate').get(saleController.getSalesByDate)

router
    .route('/')
    .get(saleController.getAllSales)
    .post(saleController.createSale);

router
    .route('/:id')
    .get(saleController.getSale)
    .patch(saleController.updateSale)
    .delete(saleController.deleteSale);


module.exports = router;
