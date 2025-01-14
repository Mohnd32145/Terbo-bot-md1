import { join, dirname } from 'path'
import { createRequire } from 'module';
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts';
import { createInterface } from 'readline'
import yargs from 'yargs'
import express from 'express'
import chalk from 'chalk'
import path from 'path'
import os from 'os'
import { promises as fsPromises } from 'fs'

// https://stackoverflow.com/a/50052194
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname) //Incorpora la capacidad de crear el método 'requerir'
const { name, author } = require(join(__dirname, './package.json')) //https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

//const app = express()
//const port = process.env.PORT || 8080;

say('yna\nbot\nMD', {
font: 'chrome',
align: 'center',
gradient: ['red', 'magenta']})
say(`Por GataDios`, {
font: 'console',
align: 'center',
gradient: ['red', 'magenta']})

var isRunning = false

async function start(file) {
if (isRunning) return
isRunning = true
const currentFilePath = new URL(import.meta.url).pathname
let args = [join(__dirname, file), ...process.argv.slice(2)]
say([process.argv[0], ...args].join(' '), {
font: 'console',
align: 'center',
gradient: ['red', 'magenta']
})
setupMaster({exec: args[0], args: args.slice(1),
})
let p = fork()
p.on('message', data => {
switch (data) {
case 'reset':
p.process.kill()
isRunning = false
start.apply(this, arguments)
break
case 'uptime':
p.send(process.uptime())
break
}})

p.on('exit', (_, code) => {
isRunning = false
console.error('خطا خطا خطا كلم شورما >> ', code)
start('main.js'); //

if (code === 0) return
watchFile(args[0], () => {
unwatchFile(args[0])
start(file)
})})

const ramInGB = os.totalmem() / (1024 * 1024 * 1024)
const freeRamInGB = os.freemem() / (1024 * 1024 * 1024)
const packageJsonPath = path.join(path.dirname(currentFilePath), './package.json')
try {
const packageJsonData = await fsPromises.readFile(packageJsonPath, 'utf-8')
const packageJsonObj = JSON.parse(packageJsonData)
const currentTime = new Date().toLocaleString()
let lineM = 'جار التحميل... '
console.log(chalk.yellow(`╭${lineM}
┊${chalk.blueBright('_________')}
┊${chalk.blueBright('|')}${chalk.yellow(`🖥️ ${os.type()}, ${os.release()} - ${os.arch()}`)}
┊${chalk.blueBright('|')}${chalk.yellow(`💾 Total RAM: ${ramInGB.toFixed(2)} GB`)}
┊${chalk.blueBright('|')}${chalk.yellow(`💽 Free RAM: ${freeRamInGB.toFixed(2)} GB`)}
┊${chalk.blueBright('_________')}
┊${chalk.blueBright('_________')}
┊${chalk.blueBright('|')} ${chalk.blue.bold(`معلومات :`)}
┊${chalk.blueBright('|')} ${chalk.blueBright('__________')} 
┊${chalk.blueBright('|')}${chalk.cyan(`💚 الرقم: ${packageJsonObj.name}`)}
┊${chalk.blueBright('|')}${chalk.cyan(`𓃠 التحديث: ${packageJsonObj.version}`)}
┊${chalk.blueBright('|')}${chalk.cyan(`💜 ديسكربشن: ${packageJsonObj.description}`)}
┊${chalk.blueBright('|')}${chalk.cyan(`😺 شورما الطرش: ${packageJsonObj.author.name} @shawarma`)}
┊${chalk.blueBright('|')}${chalk.blueBright('____________')} 
┊${chalk.blueBright('|')}${chalk.yellow(`💜 shawarma-elgamed:`)}
┊${chalk.blueBright('|')}${chalk.yellow(`• shawarma (Mario ofc)`)}
┊${chalk.blueBright('________')} 
┊${chalk.blueBright('________')}
┊${chalk.blueBright('┊')}${chalk.cyan(`الساعه :`)}
┊${chalk.blueBright('┊')}${chalk.cyan(`${currentTime}`)}
┊${chalk.blueBright('_______')} 
╰${lineM}`));
setInterval(() => {}, 1000)
} catch (err) {
console.error(chalk.red(`في خطا يشورمتي الخطا اهو: ${err}`))
}

let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
if (!opts['test'])
if (!rl.listenerCount()) rl.on('line', line => {
p.emit('message', line.trim())
})}

start('main.js')
