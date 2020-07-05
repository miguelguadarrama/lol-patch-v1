const _fetch = require('node-fetch')
const fs = require('fs')

const fetch = (url) => _fetch(url).then(res => res.json()).catch(err => {
    console.error(err)
    return { error: err }
})

const start_version = "10.6.1"

const init = async () => {
    const all_versions = await fetch(`https://ddragon.leagueoflegends.com/api/versions.json`)
    const versions = all_versions.slice(0, all_versions.indexOf(start_version) + 1)//.reverse()
    //console.log({ versions })
    const get_champions = ['Kalista']
    let data = {}
    let _data = []

    for (let version of versions) {
        const champions = await fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)
        for (let name of get_champions) {
            const cdata = await fetch(`http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${name}.json`)
            _data.push({ version, simple: champions.data[name], detailed: cdata })
            fs.writeFileSync(`./champions/${name}.json`, JSON.stringify(_data, null, 2))
        }
    }
}

init();