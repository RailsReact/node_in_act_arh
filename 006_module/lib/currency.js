const canadianDollar = 0.91;

function roundTow(amount){
  return Math.round(amount * 100)/100;
}

exports.canadianToUS = canadian => roundTow(canadian * canadianDollar);
exports.USToCanadian = us => roundTow(us / canadianDollar);