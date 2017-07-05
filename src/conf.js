'use strict';

const fs = require('fs');
const filename = __dirname + 'secure';

exports.isSecure = () => fs.existsSync(filename);

exports.setSecure = secure => {
  const action = secure ? 
    () => fs.closeSync(fs.openSync(filename, 'w')) :
    fs.unlinkSync.bind(null, filename);
  
  return action();
}