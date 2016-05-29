"use strict";
var fs = require('fs');
var Gameset = (function () {
    function Gameset() {
        this.games = [];
    }
    Gameset.prototype.getFileLines = function (inputFile, callback) {
        if (process.argv.length < 3) {
            console.log('Usage: node ' + process.argv[1] + ' inputFile (outputFile)');
            process.exit(1);
        }
        console.log('vstup:');
        var self = this;
        return fs.readFile(inputFile, 'utf8', function (err, data) {
            if (err)
                throw err;
            console.log(data);
            callback(data.split(/\r?\n/), self);
        });
    };
    Gameset.prototype.processLines = function (lines, self) {
        console.log('\nvýstup:');
        self.gamesCount = parseInt(lines.shift());
        self.loadGames(lines, self);
    };
    Gameset.prototype.loadGames = function (lines, self) {
        var line;
        for (var i = 1; i <= self.gamesCount; i++) {
            line = lines.shift();
            var _a = line.split(' '), distance = _a[0], tilesCount = _a[1];
            var tiles = [];
            while (lines.length > 0 && lines[0] !== '') {
                line = lines.shift();
                tiles.push(new (Tile.bind.apply(Tile, [void 0].concat(line.split(' '))))());
            }
            if (lines[0] === '') {
                lines.shift();
            }
            self.games.push(new Game(i.toString(), parseInt(distance), parseInt(tilesCount), tiles.shift(), tiles.shift(), tiles));
        }
    };
    Gameset.prototype.loadGameset = function () {
        var inputFile = process.argv[2];
        this.outputFile = process.argv.length > 3 ? process.argv[3] : 'output.txt';
        this.getFileLines(inputFile, this.processLines);
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
        this.result = new Result(this.name);
        this.findResult();
    }
    Game.prototype.findResult = function () {
        var solver = new DominoSolver(this.distance);
        var solution = solver.findSolution(this.firstTile, this.lastTile, this.restTiles);
        if (solution) {
            solution.unshift(this.firstTile);
            solution.push(this.lastTile);
            this.result.tileSeries = solution;
            this.result.isExisting = true;
        }
        else {
            this.result.isExisting = false;
        }
        this.printResult();
        return this.result;
    };
    Game.prototype.printResult = function () {
        var resultText = this.result.print();
        console.log(resultText);
        return resultText;
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
    Tile.prototype.couldFollow = function (value) {
        return value === this.a || value === this.b;
    };
    Tile.prototype.flip = function () {
        var a = this.a;
        this.a = this.b;
        this.b = a;
    };
    Tile.prototype.print = function () {
        return " (" + this.a + "," + this.b + ")";
    };
    return Tile;
}());
var DominoSolver = (function () {
    function DominoSolver(distance) {
        this.distance = distance;
    }
    DominoSolver.prototype.hasProperLength = function (solution) {
        var deviation = solution.length - this.distance;
        var condNecessary = deviation >= 0;
        var condConnections = deviation % 2 === 0;
        return condNecessary && condConnections;
    };
    DominoSolver.prototype.findNext = function (previous, last, options, solution) {
        if (options.length <= 0) {
            return false;
        }
        for (var index in options) {
            if (options[index].couldFollow(this.lastValue(previous))) {
                if (previous.b !== options[index].a) {
                    options[index].flip();
                }
                solution.push(options[index]);
                if (this.hasProperLength(solution) && this.reachEnd(solution, last)) {
                    return solution;
                }
                else {
                    var restOptions = options.slice(parseInt(index) + 1);
                    return this.findNext(options[index], last, restOptions, solution);
                }
            }
        }
    };
    DominoSolver.prototype.findSolution = function (firstTile, lastTile, restTiles) {
        return this.findNext(firstTile, lastTile, restTiles, []);
    };
    DominoSolver.prototype.lastValue = function (tile) {
        return tile.b;
    };
    DominoSolver.prototype.reachEnd = function (solution, last) {
        return solution[solution.length - 1].b === last.a;
    };
    return DominoSolver;
}());
var Result = (function () {
    function Result(gameName) {
        this.gameName = gameName;
        this.isExisting = false;
    }
    Result.prototype.printSeries = function () {
        if (this.isExisting) {
            var series = "";
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
        return "\u0158e\u0161en\u00ED " + this.gameName + ": " + this.printSeries();
    };
    return Result;
}());
var g = new Gameset();
g.loadGameset();
