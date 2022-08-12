const jwt = require('jsonwebtoken');

/**
 * JWT token 檢查 middleware，若通過驗證則 req.user 不等於 undefined
 */
module.exports.auth = (req, res, next) => {
  // console.log(`[COOKIE]: ${JSON.stringify(req.cookies)}`);

  const { token } = req.cookies;
  if(!token){ 
    res.status(401).send('請先登入');
    return ;
  }

  const secret = process.env.JWT_SECRET || 'secret';
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      res.status(401).send('請先登入');
    } else {
      req.user = decoded.userid;
      console.log("😀 user: ", req.user);
      next();
    }
  });
};