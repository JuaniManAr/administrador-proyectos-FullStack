const router = require('express').Router();
const controller = require('../controllers/tareas.controller');
const { requireAuth } = require('../middlewares/auth');
const { validateRequired } = require('../middlewares/validate');

router.use(requireAuth);

router.get('/', controller.list);
router.get('/resumen', controller.resumen);
router.get('/:id/historial', controller.historial);
router.get('/:id', controller.getById);

router.post(
  '/',
  validateRequired(['proyectoId', 'titulo', 'descripcion', 'responsableId', 'prioridad', 'estado', 'fechaLimite']),
  controller.create
);

router.put('/:id', controller.update);

router.patch('/:id/iniciar', controller.iniciar);
router.patch('/:id/bloquear', controller.bloquear);
router.patch('/:id/cancelar', controller.cancelar);
router.patch('/:id/finalizar', controller.finalizar);

module.exports = router;
