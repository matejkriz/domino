import * as fs from 'fs';

class Gameset { // ~vstup
  gamesCount: number; // ~K, K < 10
  games: GameInterface[];
  outputFile: string;
  constructor() {
    this.games = [];
  }
  private getLines(inputFile, callback){
    if (process.argv.length < 3) {
      console.log('Usage: node ' + process.argv[1] + ' inputFile (outputFile)');
      process.exit(1);
    }
    let self = this;
    return fs.readFile(inputFile, 'utf8', function(err, data) {
      if (err) throw err;
      console.log(data);
      callback(data.split(/\r?\n/), self);
    });
  }
  private processLines(lines, self) {
    self.gamesCount = parseInt(lines.shift());
    self.loadGames(lines, self);
  }
  private loadGames(lines, self) {
    let line;
    for(let i = 1; i <= self.gamesCount; i++){
      line = lines.shift();
      let [distance, tilesCount] = line.split(' ');
      console.log('tilesCount: ', tilesCount);
      let tiles = [];
      while(lines.length > 0 && lines[0] !== ''){
        line = lines.shift();
        tiles.push(new Tile(...line.split(' ')));
      }
      console.log('tiles: ', tiles);
      console.log('i lines[0]: ', i, ', ', lines[0]);
      if(lines[0] === '') {
        lines.shift();
      }
      self.games.push(
        new Game(
          i.toString(),
          parseInt(distance),
          parseInt(tilesCount),
          tiles.shift(),
          tiles.shift(),
          tiles
        )
      );
    }
    console.log('self.games: ', self.games);
  }
  loadGameset() {
    let inputFile = process.argv[2];
    this.outputFile = process.argv.length > 3 ? process.argv[3] : 'output.txt';
    this.getLines(inputFile, this.processLines);
  }
  printResults() {
    for(let game of this.games){
      game.printResult();
    }
  }
}

interface GameInterface {
  name: string; // index
  distance: number; // ~n, number of tiles to be fit between first two tiles
  tilesCount: number; // ~m, m ≥ n, m < 20, number of tiles from which is chosen
  firstTile: TileInterface;
  lastTile: TileInterface;
  restTiles: TileInterface[];
  result: Result;
  findResult: ()=>Result;
  printResult: ()=>string;
}

class Game implements GameInterface {
  name: string;
  distance: number;
  tilesCount: number;
  firstTile: TileInterface;
  lastTile: TileInterface;
  restTiles: TileInterface[];
  result: Result;
  constructor(
    name: string,
    distance: number,
    tilesCount: number,
    firstTile: number,
    lastTile: TileInterface,
    restTiles: TileInterface[]
  ) {
    this.name = name;
    this.distance = distance;
    this.tilesCount = tilesCount;
    this.firstTile = firstTile;
    this.lastTile = lastTile;
    this.restTiles = restTiles;
  }
  findResult() {
    // TODO
    console.warn('Not implemented yet!');
    return this.result;
  }
  printResult():string {
    return this.result.print();
  }
}

class TileInterface {
  a: number; // dots count
  b: number; // dots count
  print:()=>string;
}

class Tile implements TileInterface {
  a: number;
  b: number;
  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }
  print():string {
    return ` (${this.a},${this.b})`;
  }
}

class Result { // ~vystup
  gameName: string;
  tileSeries: TileInterface[];
  constructor(gameName: string) {
    this.gameName = gameName;
  }
  exist():boolean {
    return this.tileSeries.length > 0; // FIXME
  }
  printSeries():string {
    if(this.exist()){
      let series:string;
      for(let tile of this.tileSeries){
        series += tile.print();
      }
      return series;
    } else {
      return ' neexistuje'
    }
  }
  print():string {
    return `Řešení ${this.gameName}: ${this.printSeries()}\n`;
  }
}

let g = new Gameset();
g.loadGameset();
