/*
Created by Lin Htet Aung
Solution for "Link Character" Puzzle from "Brain-Training-Logic-Puzzles" game
Date : November 30, 2022

---Find Multiple Paths---

Fill numbers to complete 2D grid where different numbers are in different paths...
The algorithms performed in this code are 
	func.checkNumbers : check whether the input 2D array is possible to find solutions or not
	func.findEveryPaths : this function is where you can modify this code. 
												You can add more conditions to get less lines of possible paths, orginally I thought of 2 conditions;
												first one is when the current number path is completely blocking the another number, which then has no where to go.
												second one is "Hole", where the current number path formed a hole on the board.
 func.findUntillDone : obviously brute-force function, but I didn't know how to end immediately, 
 												needed only one solution so I cheated(set some global var and forced stop)
 func.sortByPathLength : sorting from shortest path length to longest path length of all-possible-paths...

 The Hole mentioned is 
 [
 [0,0,0,0,0,0],
 [0,1,1,1,1,0],
 [0,1,0,0,1,0],
 [0,1,0,0,1,0],
 [0,1,1,1,1,2],
 [0,0,2,0,0,0]];
*/

//level 9
var rows = 6, cols = 6;
var board = [
			[6,3,0,0,0,0],
			[0,0,0,0,6,0],
			[4,3,5,0,0,0],
			[0,0,0,0,5,0],
			[4,0,2,0,0,0],
			[2,0,1,0,0,1]];
var all_paths = [];
var complete = false;
console.log("\nThe original board : ");
console.log(board);

class Point{
	constructor(v,p){
		this.value = v;
		this.position = p;
		this.path = [];
	}
}

Algorithm();
function Algorithm(){
	var numbers = checkNumbers(board);
	if(numbers){
		console.log("\nIncluded numbers : ")
		console.log(numbers);
		var points = [];

		for(var i=0; i<numbers.length; i++){//Getting starting points for each character.
			points[i] = new Point(numbers[i],0);
			for(var j=0; j<rows; j++){
				if(board[j].includes(numbers[i])){
					var k = board[j].indexOf(numbers[i]);
					points[i].position = j*rows + k;
					break;
				}
			}
		}
		// console.log(points);
		for(var i=0; i< points.length; i++)
			findEveryPaths([], points[i].value, points[i].position);
		/* console.table(all_paths);

		sortByPathlength(all_paths); // This is optional

		console.table(all_paths);*/

		findUntilDone(0, [], [], points);

		outputBoard(points, deepCopy(board));

	}
	else
		console.error('You misplaced some numbers!');
}

function outputBoard(P, copyB){
	for(const n in P){
		var array = P[n].path;
		for(const i in array){
			var r = Math.floor(array[i]/rows);
			var c = array[i]%rows;
			copyB[r][c] = P[n].value;
		}
	}
	console.log("\nThe solution : ")
	console.table(copyB);
}

function findUntilDone(steps, placement, location, Pt){

	if(steps === Pt.length){
		complete = true;
		console.log("\nThe log : ")
		console.log(placement);
		// console.log(location);//location of indexes of all_paths

		for(const i in location){// if you had enabled sortByPathlength, then this would need some adjustments.
			Pt[i].path = all_paths[location[i]];
		}
		console.log("\nPoints : ");
		console.table(Pt);
	}

	for(var i=0; i<all_paths.length; i++){
		var flag = true;
		for(var j=0; j<all_paths[i].length; j++){
			if(placement.includes(all_paths[i][j])){
				flag = false;
				break;
			}
		}

		if(complete)
			break;

		if(flag)
			findUntilDone(steps+1, placement.concat(all_paths[i]), location.concat([i]), Pt);
	}
}

function sortByPathlength(array){
	for(var i=1; i<array.length; i++){
			if(array[i].length < array[i-1].length){
				goUpper(array, i);
			}
	}
}

function goUpper(array, cindex){
	for(var i=cindex; i>0; i--){
		if(array[i].length < array[i-1].length){
			var tmp = array[i-1];
			array[i-1] = array[i];
			array[i] = tmp;
		}
	}
}

function checkNumbers(data){
	var contain = [];
	var store = [];
	for(var i=0; i<rows; i++){
		for(var j=0; j<cols; j++){
			if(data[i][j] != 0){
				if(contain.includes(data[i][j])){
					store.push(data[i][j]);
					contain.splice(contain.indexOf(data[i][j]), 1);
				}
				else
					contain.push(data[i][j]);
			}
		}
	}

	if(contain.length)
		return false;
	return store;
}

function findEveryPaths(path, key, position){

	path.push(position);
	var r = Math.floor(position/rows);
	var c = position%rows;
	var map = mapping(path, key);

	if(board[r][c] === key && position != path[0]){
		all_paths.push(path);
	}
	else if(!isBlocking(map, key)){
		if(r+1 < rows && map[r+1][c] === 0)
			findEveryPaths(deepCopy(path), key, position+cols);
		if(r-1 >= 0 && map[r-1][c] === 0)
			findEveryPaths(deepCopy(path), key, position-cols);
		if(c+1 < cols && map[r][c+1] === 0)
			findEveryPaths(deepCopy(path), key, position+1);
		if(c-1 >= 0 && map[r][c-1] === 0)
			findEveryPaths(deepCopy(path), key, position-1);
		path.splice(0, path.length);
	}
}

function mapping(path, key){
	var map = Array.from(Array(rows), ()=>Array(cols).fill(1));
	for (var i = 0; i < rows; i++) {
		for(var j = 0; j < cols; j++){
			let pos = i*rows + j;
			if(board[i][j] === 0 || board[i][j] === key)
				map[i][j] = 0;
			if(path.includes(pos))
				map[i][j] = 1;
		}
	}
	return map;
}

function isBlocking(map, key){
	for(var i=0; i<rows; i++){
		for(var j=0; j<cols; j++){
			var count = 0;
			if(board[i][j] != 0 && board[i][j] != key){
				if(i === 0 || map[i-1][j] === 1)
					count++;
				if(i === rows-1 || map[i+1][j] === 1)
					count++;
				if(j === 0 || map[i][j-1] === 1)
					count++;
				if(j === cols-1 || map[i][j+1] === 1)
					count++;
				if(count == 4)
					return true;
			}
		}
	}
}

function deepCopy(arr){
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem))
      copy.push(deepCopy(elem));
    else
        copy.push(elem);
  });
  return copy;
}
