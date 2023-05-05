const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const stylesDirPath = path.join(__dirname, 'styles');
const bandlePath = path.join(__dirname, 'project-dist',  'bundle.css');

let bandle = fs.createWriteStream(bandlePath, { flags: 'w', encoding: 'utf-8' });

fsPromises.readdir(stylesDirPath, { withFileTypes: true })
  .then((files) => {
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const filePath = path.join(stylesDirPath, `${element.name}`);
      fs.stat(filePath, (err, stats) => {
        const fileInfo = path.parse(filePath);
        if (stats.isFile() && fileInfo.ext === '.css') {
          fsPromises.readFile(filePath,  {encoding: 'utf-8'})
            .then((data) => {
              if (data !== null)  { bandle.write(`${data}\n`) ; }
            });
        }   
        if(err) console.log(err);
      });
    }
  });
  