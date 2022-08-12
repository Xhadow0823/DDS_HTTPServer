const jwt = require('jsonwebtoken');

/**
 * 登入(POST) callback function
 */
module.exports = (req, res) => {
  // temp 
  const user = {
    userid: '12345',
    hash: '822d'
  };

  const { userid, hash } = req.body;

  if (userid === user.userid && hash === user.hash) {
    // set token
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign({ userid: userid }, secret, { expiresIn: '1h' });
    res.cookie('token', token);
    res.status(200).send('OK');
  } else {
    if (userid === user.userid) {
      res.status(403).send('密碼錯誤');
    } else {
      res.status(404).send('無此帳號');
    }
  }
};