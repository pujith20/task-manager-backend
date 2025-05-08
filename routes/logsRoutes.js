const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {getLogs, createLogs} = require("../controllers/logsController");


router.get('/', auth(), getLogs);
router.post('/',auth(), createLogs);

module.exports = router;