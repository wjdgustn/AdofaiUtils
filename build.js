﻿const fs = require('fs')
const cp = require('child_process')
const yargs = require('yargs-parser')
const rimraf = require('rimraf')
const archiver = require('archiver')
const info = require('./Info.json')
const path = require('path')
const { findSteamAppById } = require('find-steam-app');

(async () => {
    rimraf.sync('Release')
    
    cp.execSync('dotnet "C:\\Program Files\\dotnet\\sdk\\5.0.200\\MSBuild.dll" /p:Configuration=Release')

    fs.mkdirSync('Release')

    fs.copyFileSync(`./bin/Release/${info.Id}.dll`, `./Release/${info.Id}.dll`)

    fs.copyFileSync('./Info.json', './Release/Info.json')

    const args = yargs(process.argv)

    if (args.release) {
        const zip = archiver('zip', {})
        const stream = fs.createWriteStream(path.join(__dirname, `${info.Id}-${info.Version}.zip`))
        zip.pipe(stream)
        zip.directory('Release/', info.Id)
        await zip.finalize()
    } else {
        const appPath = await findSteamAppById(977950)
        const modPath = path.join(appPath, 'Mods', info.Id)
        const r68ModPath = path.join('G:\\Programs\\Steam\\steamapps\\common\\A Dance of Fir68e and Ice', 'Mods', info.Id)
        rimraf.sync(modPath)
        rimraf.sync(r68ModPath)
        fs.mkdirSync(modPath)
        fs.copyFileSync(`Release/${info.Id}.dll`, path.join(modPath, info.Id + '.dll'))
        fs.copyFileSync('Release/Info.json', path.join(modPath, 'Info.json'))
        fs.copyFileSync(`Release/${info.Id}.dll`, path.join(r68ModPath, info.Id + '.dll'))
        fs.copyFileSync('Release/Info.json', path.join(r68ModPath, 'Info.json'))
    }
    console.log('Successful.')
})()
