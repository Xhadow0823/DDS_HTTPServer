const { NTP } = require('../models');

/**
 * 將NTP資料恢復預設值
 */
 module.exports.reset = async () => {
  await NTP.drop();
  await NTP.sync();
  return NTP.create({
    NTPEnable: true,
    NTPHost: 'time.stdtime.gov.tw',
    TimeZone: 'Asia/Taipei'
  });
};

/**
 * 更新NTP資料，回傳Promise
 * @param {Object} NTPModel - NTP資料{NTPEnable: BOOLEAN, NTPHost: STRING, TimeZone: STRING}
 */
module.exports.update = (NTPModel) => {
  return NTP.update(NTPModel, {
    where: { id: 1 }
  });
};

/**
 * 取得唯一NTP資料，回傳Promise
 */
 module.exports.findOne = () => {
  return NTP.findByPk(1);
};

/**
 * 取得所有NTP資料，回傳Promise<[]>
 */
 module.exports.findAll = () => {
  return NTP.findAll();
};

/**
 * 新增一筆NTP資料，回傳Promise
 */
module.exports.newOne = () => {
  return NTP.create({
    NTPEnable: true,
    NTPHost: 'time.stdtime.gov.tw',
    TimeZone: 'Asia/Taipei'
  });
}

/**
 * 刪除所有NTP資料，回傳Promise\
 * Note: (NTP資料表會消失，需要NTP.sync()已進行其他NTP的操作)
 */
 module.exports.drop = () => {
  return NTP.drop();
}