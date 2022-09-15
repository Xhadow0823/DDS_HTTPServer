const { topic } = require('../models');

/*
+ todo: 
  - offset param
  - less function: dropAll, drop => drop
*/

module.exports.newOne = async ({ 
  name,  // string
  data   // double
}) => {
  return topic.create({
    name: String(name),
    data: Number(data)
  });
};

module.exports.findAll = ({
  name,  // string
  limit  // int
}) => {
  name = String(name);  limit = Number(limit);
  if(!limit) limit = 100;
  return topic.findAll({
    where: {
      name: String(name),
    },
    order: [
      ['id', 'DESC']
    ],
    limit: Number(limit)
  });
};

module.exports.findAllAll = ({
  // limit  // int [optional]
}) => {
  return topic.findAll({
    // limit: Number(limit)
  });
};

module.exports.latestOne = ({
  name  // string
}) => {
  return module.exports.findAll({ name, limit: 1 });
};

module.exports.drop = ({
  name  // string
}) => {
  return topic.drop({
    where: {
      name: String(name)
    }
  });
};

module.exports.dropAll = () => {
  return topic.drop();
}