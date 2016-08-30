const merge = (target, source) => {
  Object.assign(target, source);
  return target;
};

module.exports = merge;
