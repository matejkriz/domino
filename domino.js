"use strict";
var fs = require('fs');
var Gameset = (function () {
    function Gameset() {
        this.games = [];
    }
    Gameset.prototype.getLines = function (inputFile, callback) {
        if (process.argv.length < 3) {
            console.log('Usage: node ' + process.argv[1] + ' inputFile (outputFile)');
            process.exit(1);
        }
        var self = this;
        return fs.readFile(inputFile, 'utf8', function (err, data) {
            if (err)
                throw err;
            console.log(data);
            callback(data.split(/\r?\n/), self);
        });
    };
    Gameset.prototype.processLines = function (lines, self) {
        self.gamesCount = parseInt(lines.shift());
        self.loadGames(lines, self);
    };
    Gameset.prototype.loadGames = function (lines, self) {
        var line;
        for (var i = 1; i <= self.gamesCount; i++) {
            line = lines.shift();
            var _a = line.split(' '), distance = _a[0], tilesCount = _a[1];
            console.log('tilesCount: ', tilesCount);
            var tiles = [];
            while (lines.length > 0 && lines[0] !== '') {
                line = lines.shift();
                tiles.push(new (Tile.bind.apply(Tile, [void 0].concat(line.split(' '))))());
            }
            console.log('tiles: ', tiles);
            console.log('i lines[0]: ', i, ', ', lines[0]);
            if (lines[0] === '') {
                lines.shift();
            }
            self.games.push(new Game(i.toString(), parseInt(distance), parseInt(tilesCount), tiles.shift(), tiles.shift(), tiles));
        }
        console.log('self.games: ', self.games);
    };
    Gameset.prototype.loadGameset = function () {
        var inputFile = process.argv[2];
        this.outputFile = process.argv.length > 3 ? process.argv[3] : 'output.txt';
        this.getLines(inputFile, this.processLines);
    };
    Gameset.prototype.printResults = function () {
        for (var _i = 0, _a = this.games; _i < _a.length; _i++) {
            var game = _a[_i];
            game.printResult();
        }
    };
    return Gameset;
}());
var Game = (function () {
    function Game(name, distance, tilesCount, firstTile, lastTile, restTiles) {
        this.name = name;
        this.distance = distance;
        this.tilesCount = tilesCount;
        this.firstTile = firstTile;
        this.lastTile = lastTile;
        this.restTiles = restTiles;
    }
    Game.prototype.findResult = function () {
        console.warn('Not implemented yet!');
        return this.result;
    };
    Game.prototype.printResult = function () {
        return this.result.print();
    };
    return Game;
}());
var TileInterface = (function () {
    function TileInterface() {
    }
    return TileInterface;
}());
var Tile = (function () {
    function Tile(a, b) {
        this.a = a;
        this.b = b;
    }
    Tile.prototype.print = function () {
        return " (" + this.a + "," + this.b + ")";
    };
    return Tile;
}());
var Result = (function () {
    function Result(gameName) {
        this.gameName = gameName;
    }
    Result.prototype.exist = function () {
        return this.tileSeries.length > 0;
    };
    Result.prototype.printSeries = function () {
        if (this.exist()) {
            var series = void 0;
            for (var _i = 0, _a = this.tileSeries; _i < _a.length; _i++) {
                var tile = _a[_i];
                series += tile.print();
            }
            return series;
        }
        else {
            return ' neexistuje';
        }
    };
    Result.prototype.print = function () {
        return "\u0158e\u0161en\u00ED " + this.gameName + ": " + this.printSeries() + "\n";
    };
    return Result;
}());
var g = new Gameset();
g.loadGameset();
//# sourceMappingURL=domino.js.map