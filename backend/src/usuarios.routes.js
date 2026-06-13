const router = require('express').Router();
const controller = require('../controllers/usuarios.controller');
const { requireAuth } = require('../middlewares/auth');

router.get('/', requireAuth, controller.list);

module.exports = router;
