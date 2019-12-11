const game = (function() {
  let main = document.getElementById('main');

  function renderBoard(x, y) {
    let board = document.createElement('DIV');
    board.classList.add('board');
    for(let i = 0; i < x; i += 1) {
      for(let j = 0; j < y; j += 1) {

      }
    }
    main.appendChild(board);
  };

  return { renderBoard };
})();

game.renderBoard(10, 10);
