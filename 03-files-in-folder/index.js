const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const secretDirPath = path.join(__dirname, 'secret-folder');

fsPromises.readdir(secretDirPath, { withFileTypes: true })
  .then((files) => {
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const filePath = path.join(secretDirPath, `${element.name}`);
      const fileInfo = path.parse(filePath);
      if (element.isFile()) {
        outputFileData(filePath, fileInfo);
      }
    }
  });

function outputFileData(path, file){
  fs.stat(path, (err, data) =>{
    if(err) console.log(err);
    console.log(`${file.name} - ${(file.ext).slice(1, file.ext.length)} - ${(data['size']/1024).toFixed(2)}kb`);
  })
}
