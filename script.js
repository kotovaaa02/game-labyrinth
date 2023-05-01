const pointsArray = [
    {name: 'Алгоритмы', url: 'tests/test1.exe'},
    {name: 'Анализ и построение алгоритмов для исполнителей', url: 'tests/test2.exe'},
    {name: 'Кодирование чисел', url: 'tests/test3.exe'},
    {name: 'Перебор слов и системы счисления', url: 'tests/test4.exe'},
    {name: 'Формулы суммы и произведения', url: 'tests/test5.exe'}
];

var testCount = 0;

/* start modal */

const startModal = new bootstrap.Modal('#startModal', {
    keyboard: false
});

startModal.show();

/* test modal */

const testModal = new bootstrap.Modal('#testModal', {
    keyboard: false
});

/* warning modal */

const warningModal = new bootstrap.Modal('#warningModal', {
    keyboard: false
});

/* finish modal */

const finishModal = new bootstrap.Modal('#finishModal', {
    keyboard: false
});

/* labyrinth */

!(function (height, width, maze, walls, currentPosition) {
    height = height % 2 == 0 ? height + 1 : height;
    width = width % 2 == 0 ? width + 1 : width;
    document
        .getElementById("maze")
        .setAttribute(
            "style",
            "height:" + height * 20 + "px; width:" + width * 20 + "px"
        );
    for (var y = 0; y < height; y++) {
        maze[y] = [];
        for (var x = 0; x < width; maze[y][x++] = "wall") {
            var el = document
                .getElementById("maze")
                .appendChild(document.createElement("div"));
            el.className = "block wall";
            el.setAttribute("id", y + "-" + x);
        }
    }

    function amaze(y, x, addBlockWalls) {
        maze[y][x] = "maze";
        document.getElementById(y + "-" + x).className = "block";
        if (addBlockWalls && valid(y + 1, x) && maze[y + 1][x] == "wall")
            walls.push([y + 1, x, [y, x]]);
        if (addBlockWalls && valid(y - 1, x) && maze[y - 1][x] == "wall")
            walls.push([y - 1, x, [y, x]]);
        if (addBlockWalls && valid(y, x + 1) && maze[y][x + 1] == "wall")
            walls.push([y, x + 1, [y, x]]);
        if (addBlockWalls && valid(y, x - 1) && maze[y][x - 1] == "wall")
            walls.push([y, x - 1, [y, x]]);
    }

    function valid(a, b) {
        return a < height && a >= 0 && b < width && b >= 0 ? true : false;
    }
    amaze(currentPosition[0], currentPosition[1], true);
    while (walls.length != 0) {
        var randomWall = walls[Math.floor(Math.random() * walls.length)],
            host = randomWall[2],
            opposite = [
                host[0] + (randomWall[0] - host[0]) * 2,
                host[1] + (randomWall[1] - host[1]) * 2
            ];
        if (valid(opposite[0], opposite[1])) {
            if (maze[opposite[0]][opposite[1]] == "maze")
                walls.splice(walls.indexOf(randomWall), 1);
            else
                amaze(randomWall[0], randomWall[1], false),
                    amaze(opposite[0], opposite[1], true);
        } else walls.splice(walls.indexOf(randomWall), 1);
    }
    document.getElementById("0-0").className = "block me";
    if (testCount == pointsArray.length) {
        document.getElementById(
            parseInt(height) - 1 + "-" + (parseInt(width) - 1)
        ).className = "block finish";
    }

    for (var i = 0; i < pointsArray.length; i++) {
        var $blocks = $("#maze").find(".block:not(.wall)");
        var pointIdx = 1 + Math.floor(Math.random() * $blocks.length) - 2;
        console.log(pointIdx, $blocks.length);
        $blocks.eq(pointIdx).addClass("point").attr("data-id", i);
    }

    document.body.onkeydown = function (e) {
        if ($('.modal.show').length) {
            return;
        }
        var newPosition = [
            currentPosition[0] + ((e.keyCode - 39) % 2),
            currentPosition[1] + ((e.keyCode - 38) % 2)
        ];
        if (
            valid(newPosition[0], newPosition[1]) &&
            maze[newPosition[0]][newPosition[1]] != "wall"
        ) {
            var showModal = false;
            document.getElementById(
                currentPosition[0] + "-" + currentPosition[1]
            ).className = "block";
            currentPosition = newPosition;
            if ($("#" + currentPosition[0] + "-" + currentPosition[1]).hasClass("point")) {
                showModal = true;
            }
            document.getElementById(
                currentPosition[0] + "-" + currentPosition[1]
            ).className = "block me";
            if (currentPosition[0] != parseInt(height) - 1 || currentPosition[1] != parseInt(width) - 1) {
                if (testCount == pointsArray.length) {
                    document.getElementById(
                        parseInt(height) - 1 + "-" + (parseInt(width) - 1)
                    ).className = "block finish";
                }    
            }
            if (showModal) {
                var pointData = pointsArray[$("#" + currentPosition[0] + "-" + currentPosition[1]).data("id")];
                $('.js-test-name').text(pointData.name);
                $('.js-test-url').attr('href',pointData.url);
                $('.js-test-next').addClass('d-none');
                $('.js-test-url').removeClass('d-none');
                testModal.show();
                testCount++;
            }
            if (currentPosition[0] == height - 1 && currentPosition[1] == width - 1) {
                if (testCount == pointsArray.length) {
                    finishModal.show();
                }
                else {
                    warningModal.show();
                }
            }
        }
    };
})(parseInt(20), parseInt(20), [], [], [0, 0]);

/* start again */

$('.again').on('click', function() {
    window.location.reload();
});

/* pass test */

$('.js-test-url').on('click', function() {
    $('.js-test-next').removeClass('d-none');
    $('.js-test-url').addClass('d-none');
});

