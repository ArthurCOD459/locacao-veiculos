const { Router } = require('express');
const tratar = require('../lib/tratar');
const autenticar = require('../middleware/auth');
const auth = require('../controllers/authController');
const veiculos = require('../controllers/veiculoController');
const locacoes = require('../controllers/locacaoController');

const router = Router();

router.post('/auth/cadastro', tratar(auth.cadastrar));
router.post('/auth/login', tratar(auth.login));

router.use(autenticar);

router.get('/veiculos', tratar(veiculos.listar));
router.post('/veiculos', tratar(veiculos.cadastrar));

router.get('/locacoes', tratar(locacoes.listar));
router.post('/locacoes', tratar(locacoes.criar));
router.patch('/locacoes/:id/finalizar', tratar(locacoes.finalizar));

module.exports = router;
