const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');

// Example routes - you can modify these as needed
router.get('/', exampleController.getAllItems);
router.get('/:id', exampleController.getItemById);
router.post('/', exampleController.createItem);
router.put('/:id', exampleController.updateItem);
router.delete('/:id', exampleController.deleteItem);

module.exports = router;
