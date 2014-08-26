var tictoe = function () {
	"use strict";
	var userSelectionCount = 0,
		invokableFunc = {},
		valueArr = ['O','X'],
		classArr = ['zero','cross'],
		currentIndex = 0,
		tictoeValue = [[0,0,0],[0,0,0],[0,0,0]], // This array will have value like User slection (like zero) = 1, Computer selection (like cross) = -1 and default value is 0;
		winningCombination = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],
		preferPositions = [4,0,2,6,8,1,3,5,7],
		preferPositionsPriorityChange = [4,6,8,0,2,5,7,1,3,],
		reversePreferPositions = [4,1,3,5,7,0,2,6,8],
		ids = {
			mainContr : 'main',
			cellVal : 'cell_',
			msgCntr : 'msgCntr'
		},
		cssClass = {
			click : '.click',
			showMsg : 'showMsg'
		},
		dataElm = {
			row: 'data-row',
			col: 'data-col'
		};

	function getWinningPosition(posVal) {
		var wonLength = winningCombination.length;
		for(var i=0;i < wonLength; i++) {
			var combination = winningCombination[i],
				length = combination.length,
				nextCell = undefined,
				cntr = 0,
				frstPos = 0,
				scndPos = 0;
			for(var j=0;j< length; j++) {
				var firstCombination = winningCombination[i][j],
					firstIndex = Math.floor(firstCombination / 3),
					secondIndex = Math.floor(firstCombination % 3);

				if(tictoeValue[firstIndex][secondIndex] == posVal) {
					cntr++;
				} else if(tictoeValue[firstIndex][secondIndex] == 0) {
					frstPos = firstIndex;
					scndPos = secondIndex;
					nextCell = $('#' + ids.cellVal + firstIndex + secondIndex);
				}
			}

			if(cntr == 2 && typeof nextCell !== 'undefined') {
				tictoeValue[frstPos][scndPos] = -1;
				return nextCell;
			}
		}

		return undefined;
	}

	function stopUserFromWinning() {
		var nextCell = getWinningPosition(-1);
		if(nextCell == undefined) {
			nextCell = getWinningPosition(1);
		}

		return nextCell;
	}

	function getPreferedValue(positionArray) {
		if(typeof positionArray !== 'undefined') {
			for(var i=0,length = positionArray.length;i < length; i++) {
				var firstCombination = positionArray[i],
					firstIndex = Math.floor(firstCombination / 3),
					secondIndex = Math.floor(firstCombination % 3);

				if(tictoeValue[firstIndex][secondIndex] === 0) {
					tictoeValue[firstIndex][secondIndex] = -1;
					return $('#' + ids.cellVal + firstIndex + secondIndex);
				}
			}
		}

		return undefined;
	}

	function makeComputerSelection() {
		var nextCell = undefined;
		if(userSelectionCount > 1) {
			nextCell = stopUserFromWinning();
		}
		if(typeof nextCell !== 'undefined') {
			return nextCell;
		} else if(currentIndex < 2 && ((tictoeValue[0][0] == 1 && tictoeValue[2][2] == 1) || (tictoeValue[0][2] == 1 && tictoeValue[2][0] == 1))) {
			nextCell = getPreferedValue(reversePreferPositions);
		} else if(currentIndex < 2 && ((tictoeValue[0][0] == 1 && tictoeValue[2][1] == 1) || (tictoeValue[0][2] == 1 && tictoeValue[2][1] == 1))) {
			nextCell = getPreferedValue(preferPositionsPriorityChange);
		}

		if(nextCell == undefined) {
			nextCell = getPreferedValue(preferPositions);
		}

		return nextCell;
	}

	function wonStatus() {
		var wonLength = winningCombination.length,
			userWon = false,
			compWon = false;
		for(var i=0;i < wonLength; i++) {
			var combination = winningCombination[i],
				length = combination.length;
			for(var j=0;j< length; j++) {
				var firstCombination = winningCombination[i][j],
					firstIndex = Math.floor(firstCombination / 3),
					secondIndex = Math.floor(firstCombination % 3);

				switch(tictoeValue[firstIndex][secondIndex]) {
					case -1: if(userWon) {
								compWon = false;
								userWon = false;
							} else {
								compWon = true;
								userWon = false;
							}
							break;
					case 1: 
							if(compWon) {
								compWon = false;
								userWon = false;
							} else {
								compWon = false;
								userWon = true;
							}
							break;
					default:
							compWon = false;
							userWon = false;
				}
				
				if(!compWon && !userWon) {
					break;
				}
			}

			if(compWon) {
				return -1;
			} else if(userWon) {
				return 1;
			}
		}
		return 0;
	}

	function changeCellValues(cell) {
		if(typeof cell !== 'undefined') {
			var spanElm = $(cell),
				currentElm = spanElm;

			if(currentIndex > 1) {
				currentIndex = 0;
			}
			var nextVal = valueArr[currentIndex];
			var nextClass = classArr[currentIndex++];

			var children = currentElm.children();
			if(children.length > 0) {
				spanElm = $(children.get(0));
			} 

			spanElm.html(nextVal);
			spanElm.addClass(nextClass);

			currentElm.removeClass('click');
		} else {
			throw Error('Please pass required cell object to show selection');
		}
	}

	function logWinStatus(isWon) {
		if(isWon === 1) {
			$('#' + ids.msgCntr).html("User wins");
		} else if(isWon === -1) {
			$('#' + ids.msgCntr).html("Computer wins");
		} else {
			return;
		}
		$('#' + ids.mainContr + ' ' + cssClass.click).removeClass('click');
		$('#' + ids.msgCntr).addClass(cssClass.showMsg);
	}

	function makeUserSelection(event) {
		var currElm = $(this);
		if(currElm.length > 0) {
			var row = currElm.attr(dataElm.row),
				col = currElm.attr(dataElm.col),
				isWon = 0;

			tictoeValue[row][col] = 1;

			changeCellValues(currElm);

			userSelectionCount++;

			var nextPosition = makeComputerSelection();
			if(typeof nextPosition !== 'undefined') {
				changeCellValues(nextPosition);
			}

			if(userSelectionCount > 2) {
				isWon = wonStatus();
				logWinStatus(isWon);
			}
		}
	}

	invokableFunc.init = function () {
		$('#' + ids.mainContr).on('click', cssClass.click, makeUserSelection);
	}

	return invokableFunc;
};

$('document').ready(function () {
	var toe = tictoe();
	toe.init();
});