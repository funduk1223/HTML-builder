const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const stylesDirPath = path.join(__dirname, 'styles');
const bandlePath = path.join(__dirname, 'project-dist', 'bundle.css');

let bandle = fs.createWriteStream(bandlePath, { flags: 'w', encoding: 'utf-8' });

function mergeStyles(){
  let res = [];
  let output = [];
  fsPromises.readdir(stylesDirPath, { withFileTypes: true })
    .then((files) => {
      let p;
      files.forEach(element => {
        const filePath = path.join(stylesDirPath, `${element.name}`);
        const fileInfo = path.parse(filePath);
        if (element.isFile() && fileInfo.ext === '.css') {
          p = fsPromises.readFile(filePath, { encoding: 'utf-8' })
          p.then((data) => {
              if (data !== null) { 
                res.push(data);
                //bandle.write(`${data}\n`); 
              }
          });
        }
        output.push(p);
      });
      return Promise.all(output);
    })
  .then(() => {
    res.forEach(element => {
      bandle.write(`${element}\n`); 
    })
  })
}

mergeStyles();