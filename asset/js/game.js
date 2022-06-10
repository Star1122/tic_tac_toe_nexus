function initialize() {
  values = [[], [], []];
  turn = 0;
  isFinished = false;

  // Generating cells CELL_COUNT * CELL_COUNT
  let cells = ``;
  const size = `${(100 / CELL_COUNT)}%`;

  for (let i = 0; i < CELL_COUNT * CELL_COUNT; i++) {
    cells += `
      <div
        class="cell cell_${i + 1}"
        style="width: ${size}; height: ${size}"
        onclick="onClickCell(${i + 1})"
      >
      </div>
    `;
  }

  document.getElementById('board').innerHTML = cells;

  // Setting player opacity and image
  for (let i = 1; i <= 3; i++) {
    document.querySelector(`.player${i}`).style.opacity = i === 1 ? '1' :' 0.1';
    const image = `asset/img/${symbols[i - 1]}.svg`;
    document.querySelector(`.player${i} .player-wrapper img`).setAttribute('src',image);
  }

  // Generate possible winner methods. CELL_COUNT * 2 + 2
  generateMatches('row');
  generateMatches('column');
  generateMatches('diagonal');
}

function onClickCell(i) {
  const rest = [...values[0], ...values[1], ...values[2]];
  const isExist = rest.includes(i);

  if (!isFinished && !isExist) {
    // Setting symbol of clicked cell
    const symbol = symbols[turn];
    const cell = document.querySelector(`.cell_${i}`);
    cell.innerHTML = `<img src="asset/img/${symbol}.svg" alt={symbol} />`;

    // Saving cell index of activated user
    values[turn].push(i);

    // Checking game result
    const matched = checkGame();

    // Activating crossed line
    if (matched) {
      isFinished = true;
      winnerAction(matched);
    } else {
      controlPlayerOpacity();
    }
  }
}

function checkGame() {
  // Checking game
  for (let i = 0; i < methods.length; i++) {
    let matched = false;

    for (let j = 0; j < CELL_COUNT; j++) {
      matched = values[turn].includes(methods[i][j]);
      if (!matched) break;
    }

    if (matched) {
      return methods[i];
    }
  }

  // Going to next user
  if (turn === 2) turn = 0;
  else turn += 1;

  return null;
}

function onBack() {
  if (!isFinished) {
    if (turn === 0) turn = 2;
    else turn -= 1;

    const lastIndex = values[turn].length - 1;
    const cell = document.querySelector(`.cell_${values[turn][lastIndex]}`);
    cell.innerHTML = '';
    values[turn].pop();

    controlPlayerOpacity();
  }
}

function controlPlayerOpacity() {
  symbols.forEach((item, index) => {
    const player = document.querySelector(`.player${index + 1}`);

    if (index === turn) player.style.opacity = '1';
    else player.style.opacity = '0.1';
  });
}

function winnerAction(matched) {
  matched.forEach((item) => {
    document.querySelector(`.cell_${item}`).style.backgroundColor = '#fdce4c';
    document.querySelector(`.cell_${item} img`).classList.add('animation');
  });

  symbols.forEach((item, index) => {
    const player = document.querySelector(`.player${index + 1}`);
    const playerImg = document.querySelector(`.player${index + 1} .player-wrapper img`);

    if (index !== turn) playerImg.setAttribute('src', 'asset/img/loser.png');
    else playerImg.setAttribute('src', 'asset/img/winner.png');

    player.style.opacity = '1';
  });
}

function generateMatches(type) {
  if (type === 'diagonal') {
    const pos_step = CELL_COUNT + 1;
    const neg_step = CELL_COUNT - 1;
    let temp = [];

    for (let i = 1; i <= CELL_COUNT * CELL_COUNT; i+=pos_step) {
      temp.push(i);
    }

    methods.push(temp);
    temp = [];

    for (let i = CELL_COUNT; i <= CELL_COUNT * CELL_COUNT - 1; i+=neg_step) {
      temp.push(i);
    }

    methods.push(temp);
  } else {
    let rows = CELL_COUNT;
    let row_step = 1;
    let column_step = CELL_COUNT;

    if (type === 'column') {
      rows = CELL_COUNT * CELL_COUNT;
      row_step = CELL_COUNT;
      column_step = 1;
    }

    for (let i = 1; i <= rows; i+=row_step) {
      const temp = [];
      let columns = type === 'row' ? CELL_COUNT * CELL_COUNT : i + CELL_COUNT - 1;

      for (let j = i; j <= columns; j+=column_step) {
        temp.push(j);
      }

      methods.push(temp);
    }
  }
}
