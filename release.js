const fs = require('fs');

const filesNames = ['package.json', 'package-lock.json'];
const version = process.argv[2];

filesNames.forEach((fileName) => {
  const path = `${__dirname}/${fileName}`;
  file = fs.readFileSync(path);
  value = JSON.parse(file);
  value.version = version;
  fs.writeFile(path, JSON.stringify(value, null, 2), (err) => {
    if (err) throw err;
    console.log(`updated ${fileName} to version ${version}`);
  });
});
