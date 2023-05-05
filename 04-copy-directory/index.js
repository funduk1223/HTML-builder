const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'files');
const copyToPath = path.join(__dirname, 'files-copy');

fsPromises.mkdir(copyToPath, { recursive: true })
  .then(() => {
    console.log('===== Start copy files! =====');
    fsPromises.readdir(copyToPath, { withFileTypes: true })
      .then((files)=> {
        for (let index = 0; index < files.length; index++) {
          const element = files[index];
          const filePath = path.join(copyToPath, `${element.name}`);
          fs.unlink(filePath, err => {
            if (err) console.log(err);
          });
        }
      })
      .then(
        fsPromises.readdir(sourcePath, { withFileTypes: true })
          .then((files) => {
            for (let index = 0; index < files.length; index++) {
              const element = files[index];
              const filePath = path.join(sourcePath, `${element.name}`);
              const copyPath = path.join(copyToPath, `${element.name}`);
              console.log('*');
              fsPromises.copyFile(filePath, copyPath)
                .then(result => {
                  if (result !== undefined) console.log (`can't copy file path ${filePath}`);
                })
                .catch(err => {
                  console.log(err);
                });
            }
            console.log('= Copy files has finished! =');
          })
      );
  })
  .catch(err => console.log(err));
  