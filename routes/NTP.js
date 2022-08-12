const router = require('express').Router();

const { reset, update, findOne } = require('../controllers').NTP;
const { auth, DBSync } = require('../middlewares');

router.post('/reset', auth, DBSync, async(req, res) => {
  await reset();
  res.status(200).send('OK');
});

router.put('/update', auth, DBSync, (req, res) => {
  // todo: check data type
  console.log('[body]: ', req.body);
  update({
    NTPEnable: Boolean(req.body.NTPEnable),
    NTPHost: req.body.NTPHost,
    TimeZone: req.body.TimeZone
  }).then(() => {
    res.status(200).send('OK');
  });
});

router.get('/', DBSync, async (req, res) => {
  const data = await findOne();
  if(data !== null) {
    res.status(200).send(data);
  }else {
    res.status(404).send('Not Found');
  }
});

/** NTP 路由 */
module.exports = router;