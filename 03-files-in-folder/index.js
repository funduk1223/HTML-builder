const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const secretDirPath = path.join(__dirname, 'secret-folder');

fsPromises.readdir(secretDirPath, { withFileTypes: true })
  .then((files) => {
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const filePath = path.join(secretDirPath, `${element.name}`);
      fs.stat(filePath, (err, stats) => {
        const fileInfo = path.parse(filePath);
        if (stats.isFile()) {
          console.log(`${fileInfo.name} - ${(fileInfo.ext).slice(1, fileInfo.ext.length)} - ${(stats['size']/1024).toFixed(3)}kb`);
        }
        if(err) console.log(err);
      });
    }
  });


