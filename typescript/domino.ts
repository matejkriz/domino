import * as fs from 'fs';

class Gameset { // ~vstup
  gamesCount: number; // ~K, K < 10
  games: GameInterface[];
  outputFile: string;
  constructor() {
    this.games = [];
  }
  private getFileLines(inputFile, callback){
    if (process.argv.length < 3) {
      console.log('Usage: node ' + process.argv[1] + ' inputFile (outputFile)');
      process.exit(1);
    }
    console.log('vstup:');
    let self = this;
    return fs.readFile(inputFile, 'utf8', function(err, data) {
      if (err) throw err;
      console.log(data);
      callback(data.split(/\r?\n/), self);
    });
  }
  private processLines(lines, self) {
    console.log('\nvýstup:');
    self.gamesCount = parseInt(lines.shift());
    self.loadGames(lines, self);
  }
  private loadGames(lines, self) {
    let line;
    for(let i = 1; i <= self.gamesCount; i++){
      line = lines.shift();
      let [distance, tilesCount] = line.split(' ');
      let tiles = [];
      while(lines.length > 0 && lines[0] !== ''){
        line = lines.shift();
        tiles.push(new Tile(...line.split(' ')));
      }
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

  }
  loadGameset() {
    let inputFile = process.argv[2];
    this.outputFile = process.argv.length > 3 ? process.argv[3] : 'output.txt';
    this.getFileLines(inputFile, this.processLines);
  }
  printResults() {
    for(let game of this.games) {
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
    firstTile: TileInterface,
    lastTile: TileInterface,
    restTiles: TileInterface[]
  ) {
    this.name = name;
    this.distance = distance;
    this.tilesCount = tilesCount;
    this.firstTile = firstTile;
    this.lastTile = lastTile;
    this.restTiles = restTiles;
    this.result = new Result(this.name);
    this.findResult();
  }

  findResult():Result {
    let solver = new DominoSolver(this.distance);
    let solution = solver.findSolution(this.firstTile, this.lastTile, this.restTiles);
    if(solution){
      solution.unshift(this.firstTile);
      solution.push(this.lastTile);
      this.result.tileSeries = solution;
      this.result.isExisting = true;
    } else {
      this.result.isExisting = false;
    }
    this.printResult();
    return this.result;
  }
  printResult():string {
    const resultText = this.result.print();
    console.log(resultText);
    return resultText;
  }
}

class TileInterface {
  a: number; // dots count
  b: number; // dots count
  couldFollow:(value:number)=>boolean;
  flip:()=>void;
  print:()=>string;
}

class Tile implements TileInterface {
  a: number;
  b: number;
  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }
  couldFollow(value:number):boolean {
    return value === this.a || value === this.b;
  }
  flip():void {
    let a = this.a;
    this.a = this.b;
    this.b = a;
  }
  print():string {
    return ` (${this.a},${this.b})`;
  }
}

class DominoSolver {
  distance: number;
  constructor(distance) {
    this.distance = distance;
  }

  hasProperLength(solution) {
    const deviation = solution.length - this.distance;
    const condNecessary = deviation >= 0
    const condConnections = deviation % 2 === 0;
    return condNecessary && condConnections;
  }

  findNext(previous, last, options, solution) {
    if(options.length <= 0) {
      return false;
    }

    for(let index in options){
      if(options[index].couldFollow(this.lastValue(previous))) {
        if(previous.b !== options[index].a) {
          options[index].flip();
        }
        solution.push(options[index]);
        if(this.hasProperLength(solution) && this.reachEnd(solution, last)){
          return solution;
        } else {
          let restOptions = options.slice(parseInt(index) + 1);
          return this.findNext(options[index], last, restOptions, solution);
        }
      }
    }
  }

  findSolution(firstTile, lastTile, restTiles) {
    return this.findNext(firstTile, lastTile, restTiles, []);
  }

  lastValue(tile){
    return tile.b;
  }

  reachEnd(solution, last){
    return solution[solution.length - 1].b === last.a;
  }
}

class Result { // ~vystup
  gameName: string;
  isExisting: boolean;
  tileSeries: TileInterface[];
  constructor(gameName: string) {
    this.gameName = gameName;
    this.isExisting = false;
  }

  printSeries():string {
    if(this.isExisting){
      let series:string = "";
      for(let tile of this.tileSeries){
        series += tile.print();
      }
      return series;
    } else {
      return ' neexistuje'
    }
  }
  print():string {
    return `Řešení ${this.gameName}: ${this.printSeries()}`;
  }
}

let g = new Gameset();
g.loadGameset();
