const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'files');
const copyToPath = path.join(__dirname, 'files-copy');

clearFolder(copyToPath)
  .then(()=>{
    console.log('===== Start copy files! =====');
    copyFiles(sourcePath, copyToPath);
  })
  .then(()=>{
    console.log('= Copy files has finished! =');   
  });


function copyFiles(sourcePath, copyToPath) {
  fsPromises.mkdir(copyToPath, { recursive: true })
    .then(() => {
      fsPromises.readdir(sourcePath, { withFileTypes: true })
        .then((files) => {
          for (let index = 0; index < files.length; index++) {
            const element = files[index];
            const filePath = path.join(sourcePath, `${element.name}`);
            const copyPath = path.join(copyToPath, `${element.name}`);
            fs.stat(filePath, (err, stats) => {
              if (stats.isFile()) {
                fsPromises.copyFile(filePath, copyPath)
                  .then(result => {
                    if (result !== undefined) console.log(`can't copy file path ${filePath}`);
                  })
                  .catch(err => {
                    console.log(err);
                  });
              } else if (stats.isDirectory()) {
                copyFiles(filePath, copyPath);
              }
              if (err) console.log(err);
            });
          }
        });
    })
    .catch(err => console.log(err));
}



function clearFolder(folderPath){
  return fsPromises.rm(folderPath, { recursive: true, force: true });
}