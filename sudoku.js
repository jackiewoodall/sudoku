//////////////////////////////////////////////////////////////////////////////
function load(input){ // input = string of 81 characters representing the puzzle (row major)
  var puzzle = new Array(9);
  var caret = 0;
  for(var r=0;r<9;r++){
    puzzle[r] = new Array(9);
    for(var c=0;c<9;c++){
      var char = input[caret++];
      var v = parseInt(char);
      if(isNaN(v) || v<1 || v>9) v = 0;
      puzzle[r][c] = v;
    }
  }
  
  var p = new Puzzle(puzzle);
  
  return p;
}
//////////////////////////////////////////////////////////////////////////////
function printPuzzle(puzzle,pretty){
    for(i=0;i<puzzle.length;i++){
        var s = "";
        for(var j=0;j<9;j++){
          s += parseInt(puzzle[i][j]);
          if(pretty && (j==2 || j==5)) s += '|';
          else s += ' ';
        }
        console.log(s);
        if(pretty && (i==2 || i==5)) {
          console.log("---+---+---");
        }
    }
}
//////////////////////////////////////////////////////////////////////////////
Array.prototype.clone = function() { return this.slice(0); }
//////////////////////////////////////////////////////////////////////////////
function SSet() {
  this.n = new Array(9);
  for(var i=0;i<this.n.length;i++) this.n[i] = 0;
}

SSet.prototype.set = function(index) {
  this.n[index-1] = 1;
}

SSet.prototype.unset = function(index) {
  this.n[index-1] = 0;
}

SSet.prototype.get = function(index) {
  return this.n[index-1] === 1;
}

SSet.prototype.clone = function() {
  var c = new SSet();
  c.n = this.n.clone();
  return c;
}

SSet.prototype.print = function() {
  s = "";
  for(var i=1;i<10;i++) {
    if(this.get(i)) s += +i;
    else s += '.';
    s += ' ';
  }
  console.log(s);
}
//////////////////////////////////////////////////////////////////////////////
// a collection of SSet, one for each row, cols, and grid (9x9x9)
function Puzzle(p) {
  this.puzzle = new Array(9);
  
  this.rows = new Array(9);
  this.cols = new Array(9);
  this.grid = new Array(9);
  
  for(var i=0;i<9;i++) {
    this.puzzle[i] = [0,0,0, 0,0,0, 0,0,0];
    
    this.rows[i] = new SSet();
    this.cols[i] = new SSet();
    this.grid[i] = new SSet();
  }
  
  this.set = function(r,c,v) {
    this.puzzle[r][c] = v;
    this.rows[r].set(v);
    this.cols[c].set(v);
    this.grid[3*Math.floor(r/3) + Math.floor(c/3)].set(v);
  }
  
  this.unset = function(r,c,v) {
    this.puzzle[r][c] = 0;
    this.rows[r].unset(v);
    this.cols[c].unset(v);
    this.grid[3*Math.floor(r/3) + Math.floor(c/3)].unset(v);
  }

  for(var r=0;r<9;r++) {
    for(var c=0;c<9;c++) {
      var val = parseInt(p[r][c]);
      if(isNaN(val) == false &&val != 0 ) {
        this.set(r,c,val);
      }
    }
  }
}

Puzzle.prototype.clone = function() {
  return new Puzzle(this.puzzle);
}

Puzzle.prototype.print = function(pretty) {
  printPuzzle(this.puzzle,pretty)
  
  if(!pretty) return false;
  
  console.log("Rows:");
  for(var i = 0; i<9;i++) this.rows[i].print();
  console.log("Cols:");
  for(var i = 0; i<9;i++) this.cols[i].print();
  console.log("Grid:");
  for(var i = 0; i<9;i++) this.grid[i].print();
}

Puzzle.prototype.dump = function() {
  var s = "";
  for(var r=0; r<this.puzzle.length; r++){
      for(var c=0;c<this.puzzle[r].length;c++){
        var char = parseInt(this.puzzle[r][c]);
        char = (isNaN(char) || char < 1 || char > 9) ? '.' : char;
        s += char;
      }
  }
  return s;
}

Puzzle.prototype.get = function(r,c) {
  return this.puzzle[r][c];
}

// return a list of candidates
Puzzle.prototype.candidates = function(r,c) {
  var v = [];
  
  var row = this.rows[r];
  var col = this.cols[c];
  var grd = this.grid[3*Math.floor(r/3) + Math.floor(c/3)];
  
  for(var x=1;x<=9;x++) {
    if(row.get(x) == false && col.get(x) == false && grd.get(x) == false)
      v.push(x);
  }
  
  return v;
}
//////////////////////////////////////////////////////////////////////////////
function solve(puzzle){
    // which cell has the most information
    var min = 10;
    var v = [];
    var x,y;
    var solved = true;
    
    for(var r=0;r<9;r++){
      for(var c=0;c<9;c++){
        if(puzzle.get(r,c) == 0)
        {
          solved = false;
          var potential = puzzle.candidates(r,c);
          if(potential.length < min){
            min = potential.length;
            v = potential;
            x = r;
            y = c;
          }
        }
      }
    }
    
    if(solved) {
      puzzle.print(false);
      return puzzle;
    }
    
    for(var i=0;i<v.length;i++) {
      var clone = puzzle.clone();
      clone.set(x,y,v[i]);
      clone = solve(clone);
      if( clone !== false ) return clone;
    }

    return false;
}
var testSeries = [
    "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......",
    "003020600900305001001806400008102900700000008006708200002609500800203009005010300",
    ".47.2....8....1....3....9.2.....5...6..81..5.....4.....7....3.4...9...1.4..27.8..",
//  ".....6....59.....82....8....45........3........6..3.54...325..6..................", // very hard 305.481 sec
    "4.836......9.....4..35...8...41....5...6.3...6....79...9...85..3.....4......258.3",
    ".59.....6.8..693.41..84.95..9...51..5.7.8.6.9..17...4..26.54..39.567..2.3.....56.", // bronze
    "....3.6.43..7.9.1.9.2.6...7..46...2.8...7...6.3...29..1...9.2.8.7.5.8..32.3.4...."  // silver
];
