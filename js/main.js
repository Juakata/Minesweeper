let best = localStorage.getItem("best");

const game = (function() {
  const main = document.getElementById('main');

  function gameOver(result) {
    let board = document.getElementById('board');
    board.style.pointerEvents = "none";
    const squares = board.querySelectorAll(".square");
    const mines = board.querySelectorAll(".mine");
    squares.forEach(ele => {
      ele.style.background = 'green';
    });
    mines.forEach(ele => {
      ele.style.background = '#b02525';
    });
    const score = parseInt(document.getElementById('points').innerHTML);
    if(score > best) {
      localStorage.setItem("best", score);
    }
    const img = document.getElementById('img-face');
    img.style.display = "block";
    if(result === 1) {
      img.src = "images/happy.png";
    } else {
      img.src = "images/bad.png";
    }
  }

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
    check.push(document.getElementById(`square${mx}-${my}`));
    let count = parseInt(document.getElementById('points').innerHTML);
    const aux = count;
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
          if(element.style.pointerEvents !== 'none') {
            xy = getXY(element);
            x = xy[0];
            y = xy[1];
            element.style.background = 'green';
            element.style.boxShadow = 'none';
            count += 1;
            element.style.pointerEvents = 'none';
            let mines = countMines(x, y);
            element.style.padding = "4.5px";
            element.innerHTML = mines;
            if(!checked.includes(element)) {
              check.push(element);
            }
          }
        }
      });
      check.splice(0, 1);
      checked.push(current);
    }
    if(aux === count){
      count += 1;
    }
    if(count === parseInt(document.getElementById('points-needed').innerHTML)) {
      gameOver(1);
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
      obj.style.background = "b02525";
      obj.innerHTML = 'x';
      gameOver(0);
    } else {
      obj.style.background = "green";
      obj.style.boxShadow = 'none';
      const idArr = getXY(obj);
      let result = countMines(idArr[0], idArr[1]);
      obj.innerHTML = result;
      showGreens(idArr[0], idArr[1])
    }
  }

  function renderBoard(x, y, n) {
    if(document.getElementById('board') !== null) {
      document.getElementById('main').removeChild(document.getElementById('board'));
      document.getElementById('points').innerHTML = 0;
    }
    document.getElementById('img-face').style.display = "none";
    const board = document.createElement('DIV');
    let count = 0;
    board.classList.add('board');
    board.id = 'board';
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
    document.getElementById('points-needed').innerHTML = x * y - count;
    if(best === null) {
      localStorage.setItem("best", 0);
      document.getElementById('best').innerHTML = best;
    } else {
      document.getElementById('best').innerHTML = best;
    }

    main.appendChild(board);
  };

  return { renderBoard };
})();

game.renderBoard(10, 10, (10 * 10) / 2);

document.getElementById('create').addEventListener('click', () => {
  const size = parseInt(document.getElementById('size').value);
  game.renderBoard(size, size, (size * size) / 2);
}, false);
