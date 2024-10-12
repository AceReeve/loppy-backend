const fs = require('fs');
const path = require('path');

export const logError = (error: any, error_type: string) => {
  const date = new Date();
  const logFileName = `${error_type}-${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}.log`;
  fs.appendFileSync(
    path.join(__dirname, '../logs', logFileName),
    `[${date.toISOString()}] - Error: ${error}\n`,
  );

  console.log(__dirname);
};
