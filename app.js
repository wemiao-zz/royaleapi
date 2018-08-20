const request = require('request');
const config = require('config');
const keys = config.get('keys');

// auth key you can get by requesting at the royaleapi discord channel
const options = { method: 'GET',
    headers: { auth: config.get('authKey') }
};

// getBestWarDecks(options);

getPlayerCoverage(options, '9RGYYYJL');

// getClanWar(options, '9UG2R2LQ');

// getClanStats()

// function getClanStats(options, clanCode) {

// }

function getClanWar(options, clanCode) {
    options.url = `https://api.royaleapi.com/clan/${clanCode}/battles?type=war`;

    request(options, function (error, response, body) {
        let parsed = JSON.parse(body);
        for (let entry of parsed) {
            console.log(entry.team[0].name);
        }
    });
}

function getPlayerCoverage(options, playerCode) {
    options.url = `https://api.royaleapi.com/player/${playerCode}`;

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let parsed = JSON.parse(body);
        let cardStats = {
            bronze: 0,
            bronzeOver: 0,
            silver: 0,
            silverOver: 0,
            gold: 0,
            goldOver: 0,
            legend: 0,
            legendOver: 0
        };
        for (let card of parsed.cards) {
            switch(card.rarity) {
                case 'Common':
                    cardStats = calculateCoverageStats(cardStats, card, 13);
                    break;
                case 'Rare':
                    cardStats = calculateCoverageStats(cardStats, card, 11);
                    break;
                case 'Epic':
                    cardStats = calculateCoverageStats(cardStats, card, 8);
                    break;
                case 'Legendary':
                    cardStats = calculateCoverageStats(cardStats, card, 5);
                    break;
            }
        }
        cardStats = {
            bronze: `${cardStats.bronze} / ${calculatePercentage(cardStats.bronze, 86)}%`,
            bronzeOver: `${cardStats.bronzeOver} / ${calculatePercentage(cardStats.bronzeOver, 86)}%`,
            silver: `${cardStats.silver} / ${calculatePercentage(cardStats.silver, 86)}%`,
            silverOver: `${cardStats.silverOver} / ${calculatePercentage(cardStats.silverOver, 86)}%`,
            gold: `${cardStats.gold} / ${calculatePercentage(cardStats.gold, 86)}%`,
            goldOver: `${cardStats.goldOver} / ${calculatePercentage(cardStats.goldOver, 86)}%`,
            legend: `${cardStats.legend} / ${calculatePercentage(cardStats.legend, 86)}%`,
            legendOver: `${cardStats.legendOver} / ${calculatePercentage(cardStats.legendOver, 86)}%`
        }
        console.log(cardStats);
    });
}

function calculatePercentage(num, maxCards) {
    return ((num / maxCards) * 100).toFixed(0);
}

function calculateCoverageStats(cardStats, card, maxLevel) {
    if (card.level === maxLevel) {
        cardStats.legendOver++;
    }
    if (card.level >= maxLevel - 1) {
        cardStats.legend++;
        cardStats.goldOver++;
    }
    if (card.level >= maxLevel - 2) {
        cardStats.gold++;
        cardStats.silverOver++;
    }
    if (card.level >= maxLevel - 3) {
        cardStats.silver++;
        cardStats.bronzeOver++;
    }
    if (card.level >= maxLevel - 4) {
        cardStats.bronze++;
    }
    return cardStats;
}

function getBestWarDecks(options) {
    options.url = 'https://api.royaleapi.com/popular/decks';
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        let regex = RegExp(`${keys['poison']}|${keys['miner']}`);

        let exclusionString = `${keys['tesla']}|${keys['skeletons']}|${keys['pekka']}|${keys['furnace']}`;

        let exclusions = RegExp(exclusionString);

        let countSize = 2;
        let count;
        let include;
        let elixirCount;

        let parsed = JSON.parse(body);
        let outStr;
        let link; 
        for (let deck of parsed) {
            include = true;
            link = 'https://link.clashroyale.com/deck/en?deck=';

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
                    outStr += `${card.key} `;
                    link += `${card.id};`;
                }
                // remove last semicolon
                link = link.slice(0, -1);
                outStr += ` avg elixir cost: ${elixirCount / 8}`;
                console.log(outStr);
                console.log(link);
            }
        } 
    });
}
