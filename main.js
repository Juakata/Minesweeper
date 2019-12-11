const game = (function() {
  const main = document.getElementById('main');

  function getXY(obj) {
    const id = obj.id.slice(6, obj.id.size);
    const arrId = id.split("");
    let x = "";
    let y = "";
    aux = 0;
    arrId.forEach(e => {
      if(aux === 0 && e !== '-') {
        x += e;
      } else if(e === '-'){
        aux = 1;
      }else {
        y += e;
      }
    });

    return [parseInt(x), parseInt(y)];
  }

  function showGreens(mx, my) {
    const check = [];
    const checked = [];
    check.push(document.getElementById(`square${mx}-${my}`))
    let count = parseInt(document.getElementById('points').innerHTML) + 1;
    while(check.length > 0) {
      let current = check[0];
      let xy = getXY(current);
      let x = xy[0];
      let y = xy[1];
      const squares = [];
      squares.push(document.getElementById(`square${x + 1}-${y}`));
      squares.push(document.getElementById(`square${x - 1}-${y}`));
      squares.push(document.getElementById(`square${x}-${y + 1}`));
      squares.push(document.getElementById(`square${x}-${y - 1}`));
      squares.forEach(element => {
        if(element !== null) {
          xy = getXY(element);
          x = xy[0];
          y = xy[1];
          element.style.background = 'green';
          let mines = countMines(x, y);
          element.style.padding = "4.5px";
          element.innerHTML = mines;
          if(!checked.includes(element)) {
            check.push(element);
            count += 1;
          }
        }
      });
      check.splice(0, 1);
      checked.push(current);
    }
    document.getElementById('points').innerHTML = count;
  }

  function countMines(x, y) {
    const squares = [];
    let count = 0;
    squares.push(document.getElementById(`mine${x + 1}-${y}`));
    squares.push( document.getElementById(`mine${x - 1}-${y}`));
    squares.push( document.getElementById(`mine${x}-${y + 1}`));
    squares.push( document.getElementById(`mine${x}-${y - 1}`));
    squares.push( document.getElementById(`mine${x + 1}-${y - 1}`));
    squares.push( document.getElementById(`mine${x - 1}-${y + 1}`));
    squares.push( document.getElementById(`mine${x + 1}-${y + 1}`));
    squares.push(document.getElementById(`mine${x - 1}-${y - 1}`));
    squares.forEach(e => {
      if(e !== null){
        count += 1;
      }
    });
    return count;
  }

  function look(event) {
    let obj = event.target;
    obj.style.padding = "4.5px";
    if(obj.className === "mine") {
      obj.style.background = "red";
      obj.innerHTML = 'x';
    } else {
      obj.style.background = "green";
      const idArr = getXY(obj);
      let result = countMines(idArr[0], idArr[1]);
      obj.innerHTML = result;
      showGreens(idArr[0], idArr[1])
    }
  }

  function renderBoard(x, y, n) {
    const board = document.createElement('DIV');
    let count = 0;
    board.classList.add('board');
    board.style.gridTemplateColumns = `repeat(${x}, 1fr)`;
    for(let i = 0; i < x; i += 1) {
      for(let j = 0; j < y; j += 1) {
        let square = document.createElement("DIV");
        if((Math.floor(Math.random() * (3 - 1)) + 1) === 1 && count < n) {
          square.id = `mine${i}-${j}`;
          square.classList.add('mine');
          count += 1;
        } else {
          square.classList.add('square');
          square.id = `square${i}-${j}`;
        }

        square.addEventListener('click', look.bind(square.id));
        board.appendChild(square);
      }
    }
    document.getElementById('need-points').innerHTML = 50 * 50 - count;
    main.appendChild(board);
  };

  return { renderBoard };
})();

game.renderBoard(50, 50, (50 * 50) / 2);
