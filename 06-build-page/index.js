const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const componentsDirPath = path.join(__dirname, 'components');

const stylePath = path.join(projectDistPath, 'style.css');
const styleDirPath = path.join(__dirname, 'styles');

const htmlPath = path.join(projectDistPath, 'index.html');
const htmlTamplatePath = path.join(__dirname, 'template.html');

const assetSourcePath = path.join(__dirname, 'assets');
const assetDistPath = path.join(projectDistPath, 'assets');

console.log('Clear Project-Dist before Initialization');
clearFolder(projectDistPath)
  .then(() => {
    builder();
  });


function builder() {
  fsPromises.mkdir(projectDistPath, { recursive: true })
    .then(() => {
      // Copy assets folder
      copyFiles(assetSourcePath, assetDistPath);
      console.log('Copy Assets folder to Project-Dist');
    })
    .then(() => {
      // Create general style -> style.css
      let style = fs.createWriteStream(stylePath, { flags: 'w', encoding: 'utf-8' });
      generateStyle(styleDirPath, style);
      console.log('Generate StyleSheet');

    })
    .then(() => {
      // Create general html -> index.html
      let html = fs.createWriteStream(htmlPath, { flags: 'w', encoding: 'utf-8' });
      generateHtml(htmlTamplatePath, html);
      console.log('Generate HTML');
    });


}

function clearFolder(folderPath) {
  return fsPromises.rm(folderPath, { recursive: true, force: true });
}

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

function generateStyle(dirPath, styleFile) {
  let output = [];
  let res = [];
  fsPromises.readdir(dirPath, { withFileTypes: true })
    .then((files) => {
      files.forEach((element) => {
        const filePath = path.join(dirPath, `${element.name}`);
        let p = getDataFromFile(filePath);
        const fileInfo = path.parse(filePath);
        if (element.isFile() && fileInfo.ext === '.css') {
          p.then((data) => {
            res.push(data);
          });
        }
        output.push(p);
      });
      return Promise.all(output);
    })
    .then(() => {
      res.forEach(element => {
        styleFile.write(`${element}\n`);
      })
    })
}

function generateHtml(tamplatePath, htmlFile) {
  let res = [];
  let output = [];
  let reg = new RegExp(/({{([a-z])+}})/);
  fsPromises.readFile(tamplatePath, { encoding: 'utf-8' })
    .then(data => {
      if (data !== null) {
        res = data.split('\r\n');
      }
      return res;
    })
    .then((arr) => {
      arr.forEach((element, index) => {
        if (reg.test(element)) {
          const fileTamplateName = `${element.match(/([a-z])+/ig)}.html`;
          const fileTamplatePath = path.join(componentsDirPath, fileTamplateName);
          let p = getDataFromFile(fileTamplatePath);
          p.then((data) => {
            res.splice(index, 1, data);
          });
          output.push(p);
        }
      });
      return Promise.all(output);
    })
    .then(() => {
      res.forEach((element) => {
        htmlFile.write(`${element}\r\n`);
      });
    });
}

function getDataFromFile(path) {
  return fsPromises.readFile(path, { encoding: 'utf-8' });
}