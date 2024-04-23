// весь скрипт — это один большой метод
planck.testbed("Galton Board", (testbed) => {
	// размер шарика
	const BALL_SIZE = 0.1;
	// размер круга, на который падает шар
	const NAIL_SIZE = BALL_SIZE * 3;
	// ширина дорожки
	const LANE_SIZE = BALL_SIZE * 6;
	// количество дорожек
	const LANE_NUM = 25;
	// размер доски
	const SIZE = LANE_SIZE * LANE_NUM * 2;
	// расстояние между дорожками и шариками
	const LANE_MARGIN = 1.75;
	// вычисляем координаты по горизонтали
	const xPos = (x, y) => {
	  return (x * 2 - Math.abs(y)) * LANE_SIZE;
	};
	// и координаты по вертикали
	const yPos = (y) => {
	  return SIZE - y * LANE_SIZE * LANE_MARGIN;
	};
	// вычисляем верхние координаты дорожек
	const LANE_TOP_YPOS = yPos(LANE_NUM);
	// задаём длину дорожек
	const LANE_LENGTH = SIZE / 1.6 + LANE_TOP_YPOS;
	// количество шариков
	const BALL_NUM = 1000;
	// подключаем движок
	const pl = planck,
	  Vec2 = pl.Vec2;
	// создаём новый мир и добавляем гравитацию
	const world = pl.World({
	  gravity: Vec2(0, -70)
	});
	// создаём виртуальную доску
	const board = world.createBody();
	// каким цветом будем рисовать
	board.render = { fill: "#1e5f74", stroke: "#1e5f74" };
	// рисуем левую половину доски
	board.createFixture(
	  // 
	  pl.Chain([
		Vec2(xPos(0, LANE_NUM) - NAIL_SIZE, yPos(-3)),
		Vec2(xPos(0, -3), yPos(-3)),
		Vec2(xPos(0, -1), yPos(-1)),
		Vec2(xPos(0, 1), yPos(1)),
		Vec2(xPos(0, LANE_NUM), LANE_TOP_YPOS),
		Vec2(xPos(0, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS),
		Vec2(xPos(0, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE),
		Vec2(0, LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE),
		Vec2(0, LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE),
		Vec2(xPos(0, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE),
		Vec2(xPos(0, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS)
	  ])
	);
	// и сразу рисуем правую половину доски
	board.createFixture(
	  pl.Chain([
		Vec2(xPos(LANE_NUM, LANE_NUM) + NAIL_SIZE, yPos(-3)),
		Vec2(xPos(3, -3), yPos(-3)),
		Vec2(xPos(1, -1), yPos(-1)),
		Vec2(xPos(1, 1), yPos(1)),
		Vec2(xPos(LANE_NUM, LANE_NUM), LANE_TOP_YPOS),
		Vec2(xPos(LANE_NUM, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS),
		Vec2(xPos(LANE_NUM, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE),
		Vec2(0, LANE_TOP_YPOS - LANE_LENGTH + NAIL_SIZE),
		Vec2(0, LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE),
		Vec2(xPos(LANE_NUM, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH - NAIL_SIZE),
		Vec2(xPos(LANE_NUM, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS)
	  ])
	);
	// рисуем дорожки
	for (let x = 1; x < LANE_NUM; x++) {
	  // 
	  board.createFixture(
		pl.Chain([
		  Vec2(xPos(x, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH),
		  Vec2(xPos(x, LANE_NUM) - NAIL_SIZE, LANE_TOP_YPOS),
		  Vec2(xPos(x, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS),
		  Vec2(xPos(x, LANE_NUM) + NAIL_SIZE, LANE_TOP_YPOS - LANE_LENGTH)
		])
	  );
	}
	// рисуем столбики, которые задают направления шарам
	for (let y = 1; y <= LANE_NUM; y++) {
	  // рисуем их в шахматном порядке
	  for (let x = 0; x <= Math.abs(y); x++) {
		// 
		board.createFixture(pl.Circle(Vec2(xPos(x, y), yPos(y)), NAIL_SIZE));
	  }
	}
	
	// переменная для таймера
	let dropBallsId = 0;
	// массив с шариками
	let balls = [];
	// функция выбрасывания одного шарика на доску
	const dropBall = () => {
	  // создаём шар
	  const ball = world.createDynamicBody({
		// задаём случайное положение в воронке
		position: Vec2(xPos(2, -2) * 2 * Math.random() - xPos(2, -2), yPos(-2))
	  });
	  // рисуем шар
	  ball.render = { fill: "#fcdab7", stroke: "#1e5f74" };
	  // описываем внутренние свойства шара — плотность, силу трения и прыгучесть
	  ball.createFixture(pl.Circle(BALL_SIZE), {
		density: 1000.0,
		friction: 10,
		restitution: 0.3
	  });
	  // добавляем очередной шар
	  balls.push(ball);
	};
	// высыпаем все шары по очереди
	const dropBalls = (ballNum) => {
	  // высыпаем шары с определённым интервалом
	  dropBallsId = setInterval(() => {
		// бросаем шар
		dropBall();
		// уменьшаем количество шаров
		ballNum--;
		// если шаров не осталось — останавливаемся
		if (ballNum <= 0) {
		  clearInterval(dropBallsId);
		}
	  }, 200);
	};
	// убираем все шарики
	const clearBalls = () => {
	  balls.forEach((ball) => {
		// убираем их из виртуального мира
		world.destroyBody(ball);
	  });
	  // ощищаем массив с шариками
	  balls = [];
	  // останавливаем высыпание шаров с определённым интервалом по времени
	  clearInterval(dropBallsId);
	};
  
	// добавляем реакцию на нажатия клавиш
	testbed.keydown = (code, char) => {
	  // смотрим, какая клавиша нажата
	  switch (char) {
		// если X — перезапускаем все шары
		case "X":
		  clearBalls();
		  dropBalls(BALL_NUM);
		  break;
		// если D — роняем один шарик
		case "D":
		  dropBall();
		  break;
		// если C — очищаем доску
		case "C":
		  clearBalls();
		  break;
	  }
	};
	// высыпаем все шарики
	dropBalls(BALL_NUM);
	// возвращаем, что получилось
	return world;
  });