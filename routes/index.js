const Router = require('express').Router;

const { DBSync, DBAuthTest, auth } = require('../middlewares');
const login = require('./login');
const NTP = require('./NTP');
const DDS = require('./DDS');

const router = Router();

router.use('/status', (req, res) => {
  res.send('this is status');
});
router.use('/NTP', NTP);

router.use('/TCP', (req, res) => {
  res.send('this is TCP');
});
router.use('/routingService', (req, res) => {
  res.send('this is routingService');
});
router.use('/serialModbus', (req, res) => {
  res.send('this is serialModbus');
});
router.use('/serialOverTCP', (req, res) => {
  res.send('this is serialOverTCP');
});
router.use('/firewall', auth, (req, res) => {
  res.send('this is firewall' + '\n user: ' + req.user);
});

router.use('/dds', DDS);

// login
router.post('/login', DBSync, login);

router.use('/', (req, res) => {
  res.send('this is api');
});

module.exports = router;