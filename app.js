const request = require('request');
const config = require('config');

// auth key you can get by requesting at the royaleapi discord channel
const options = { method: 'GET',
    // url: 'https://api.royaleapi.com/clan/2CCCP',
    // url: 'https://api.royaleapi.com/player/820CGRLGU',
    // url: 'https://api.royaleapi.com/player/820CGRLGU/chests',
    // url: 'https://api.royaleapi.com/popular/decks?max=5',

    url: 'https://api.royaleapi.com/popular/decks',
    headers: { auth: config.get('authKey') }
};

const keys = {
    'archers': 26000001,
    'arrows': 28000001,
    'baby-dragon': 26000015,
    'balloon': 26000006,
    'bandit': 26000046,
    'barbarians': 26000008,
    'barbarian-barrel': 28000015,
    'barbarian-hut': 27000005,
    'bats': 26000049,
    'battle-ram': 26000036,
    'bomber': 26000013,
    'bomb-tower': 27000004,
    'bowler': 26000034,
    'cannon': 27000000,
    'cannon-cart': 26000054,
    'clone': 28000013,
    'dark-prince': 26000027,
    'dart-goblin': 26000040,
    'electro-wizard': 26000042,
    'elite-barbarians': 26000043,
    'elixir-collector': 27000007,
    'executioner': 26000045,
    'fireball': 28000000,
    'fire-spirits': 26000031,
    'flying-machine': 26000057,
    'freeze': 28000005,
    'furnace': 27000010,
    'giant': 26000003,
    'giant-skeleton': 26000020,
    'giant-snowball': 28000017,
    'goblin-barrel': 28000004,
    'goblin-gang': 26000041,
    'goblin-hut': 27000001,
    'goblins': 26000002,
    'golem': 26000009,
    'graveyard': 28000010,
    'guards': 26000025,
    'heal': 28000016,
    'hog-rider': 26000021,
    'hunter': 26000044,
    'ice-golem': 26000038,
    'ice-spirit': 26000030,
    'ice-wizard': 26000023,
    'inferno-dragon': 26000037,
    'inferno-tower': 27000003,
    'knight': 26000000,
    'lava-hound': 26000029,
    'lightning': 28000007,
    'lumberjack': 26000035,
    'magic-archer': 26000062,
    'mega-knight': 26000055,
    'mega-minion': 26000039,
    'miner': 26000032,
    'minions': 26000005,
    'minion-horde': 26000022,
    'mini-pekka': 26000018,
    'mirror': 28000006,
    'mortar': 27000002,
    'musketeer': 26000014,
    'night-witch': 26000048,
    'pekka': 26000004,
    'poison': 28000009,
    'prince': 26000016,
    'princess': 26000026,
    'rage': 28000002,
    'rascals': 26000053,
    'rocket': 28000003,
    'royal-ghost': 26000050,
    'royal-giant': 26000024,
    'royal-hogs': 26000059,
    'skeleton-army': 26000012,
    'skeleton-barrel': 26000056,
    'skeletons': 26000010,
    'sparky': 26000033,
    'spear-goblins': 26000019,
    'tesla': 27000006,
    'the-log': 28000011,
    'three-musketeers': 26000028,
    'tombstone': 27000009,
    'tornado': 28000012,
    'valkyrie': 26000011,
    'witch': 26000007,
    'wizard': 26000017,
    'x-bow': 27000008,
    'zap': 28000008,
    'zappies': 26000052
}

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    let regex = RegExp(`${keys['miner']}|${keys['royal-ghost']}`);
    // let regex = /skeleton-barrel/;

    let exclusionString = `${keys['giant']}|${keys['lumberjack']}|${keys['electro-wizard']}|${keys['bandit']}|${keys['goblin-gang']}`;

    let exclusions = RegExp(exclusionString);

    let countSize = 2;
    let count;
    let include;
    let elixirCount;

    let parsed = JSON.parse(body);
    let outStr;
    for (let deck of parsed) {
        include = true;

        elixirCount = 0;
        count = 0;
        outStr = '';
        for (let card of deck.cards) {
            if(regex.test(card.id)) {
                count++;
            }
            if (exclusions.test(card.id)) {
                include = false;
            }
        }
        if (count === countSize && include) {
            console.log(`deck popularity: ${deck.popularity}`);

            for (let card of deck.cards) {
                elixirCount += card.elixir;
                console.log(`'${card.key}': ${ card.id},`);
                outStr += `${card.key} `
            }
            outStr += ` avg elixir cost: ${elixirCount / 8}`;
            console.log(outStr);
        }
    } 
});