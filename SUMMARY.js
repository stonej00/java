const fs   = require('fs')
const path = require('path')
;(async function () {try {await main()} catch (err) {console.error(err)}})()

// 入口
async function main() {await entry()}

function template(key) {
  let root = path.resolve(__dirname, './src', key)

  let begin = `* [${key}](src/${key}/index.md)`

  let subFolders = fs.readdirSync(root)
  subFolders     = subFolders.filter(item => item !== 'index.md' && item !== '.DS_Store' && !item.includes('IntelliJ_IDEA'))
  let r          = ''
  for (let subFolder of subFolders) {
    r += `    - [${subFolder.replace(/\d+_/img, '')}](src/${key}/${subFolder}/index.md)\n`

    // 第三层
    {
      let level3  = path.resolve(__dirname, `src/${key}/${subFolder}`)
      let strings = fs.readdirSync(level3)
      strings     = strings.filter(string => {
        let stats = fs.statSync(path.join(level3, string))
        return !stats.isFile() && string !== 'img'
      })
      if (strings.length > 0) {
        for (let string of strings) {
          r += `        * [${string.replace(/\d+_/img, '')}](src/${key}/${subFolder}/${string}/index.md)\n`
        }
      }
    }

  }

  let s = begin + '\n' + r

  return s
}

async function entry() {
  // let src     = path.resolve(__dirname, './src')
  // let strings = fs.readdirSync(src)
  // strings     = strings.filter(item => {return item !== '.DS_Store' && item !== 'TODO' && item !== 'ignore'})

  //   let content = `
  // # Summary
  // * [简介](README.md)
  // * [--------------------------------------------]()
  // * [学习相关](src/学习相关/index.md)
  // * [--------------------------------------------]()
  // * [IntelliJ IDEA相关](src/学习相关/IDEA/index.md)
  // * [--------------------------------------------]()
  // * [面试相关](src/面试相关/index.md)
  // * [--------------------------------------------]()
  // * [其他](src/其他/index.md)
  // `

  // * [其他](src/其他/index.md)
  //     - [疑问](src/其他/000_疑问/index.md)
  let r = `# Summary
* [简介](README.md)
`
  r     = r + '* [--------------------------------------------]()\n' + template('学习相关')
  r     = r + `* [--------------------------------------------]()\n` + template('IDEA')
  r     = r + `* [--------------------------------------------]()\n` + template('面试相关')
  r     = r + `* [--------------------------------------------]()\n` + template('其他')
  console.log(r)
  await pWriteTextFile(path.resolve(__dirname, './SUMMARY.md'), r)
}

function pWriteTextFile(filepath, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, 'utf8', function (err) {
      if (err) {reject(err)} else {resolve()}
    })
  })
}