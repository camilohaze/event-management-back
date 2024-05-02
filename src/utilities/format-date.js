const formatDate = (date) =>  {
  return date.split('/').reverse().join('-');
}

module.exports = formatDate;