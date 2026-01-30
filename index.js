const weapons = [
    "Any",
    "Grimoire",
    "Unarmed",
    "Scepter",
    "Staff",
    "Scythe",
    "Duplicator",
    "Hammer",
    "Axe",
    "Flail",
    "Shield",
    "Boomerang",
    "Crossbow",
    "Katana",
    "Speedy",
    "Lance",
    "Splodey",
    "Bow",
    "Flask",
    "Orbital",
    "Sword",
    "Slammy",
    "Wrench",
    "Shuriken",
    "Dagger",
    "Spear",
    "Grower",
    "Lazer",
    "Growerslam",
    "Orbislam",
]

var player1;
var player2;

var players = ["null value 1", "null value 1"];
let _currentDragImage = null;

let gameList = [];

fetch("titles.txt").then(res => res.text()).then(text => {
    gameList = text.split("\n").map(line => line.trim()).filter(Boolean);
    console.log("Loaded:", gameList);
});

function search() {
    const anyCheck = players.indexOf("Any");
    if (anyCheck !== -1) players[anyCheck] = " ";


    document.getElementById("viewer").style.display = "flex";
    if (!gameList || gameList.length === 0) return;
    if (!players[0] || !players[1]) return;

    const matchedGames = [];
    const browser = document.getElementById("browser");
    browser.innerHTML = "";

    for (let i = 0; i < gameList.length; i++) {
        const entry = gameList[i];
        if (entry.includes(players[0]) && entry.includes(players[1])) {
            const game = document.createElement("ul");
            game.classList.add("browserItem");
            game.id = String(i);
            game.innerText = entry.split(" -|- ")[0];;
            game.addEventListener("click", () => load(game.id));
            matchedGames.push(entry);
            browser.appendChild(game);
        }
    }

    console.log("Matches:", matchedGames);
}

function load(gameIdx) {
    var playerDiv = document.getElementById("yt-player");
    console.log(gameIdx);
    var vid_id = gameList[gameIdx].split(" -|- ")[1];
    console.log(vid_id);
    var embed = `<iframe width='441' height='784' src='https://www.youtube.com/embed/${vid_id}' frameborder='1' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe>`
    playerDiv.innerHTML = embed;
    console.log(embed);
}

function generateSelector() {
    let ballSelect = document.getElementById("selectContainer");
    for (let i = 0; i < weapons.length; i++) {
        var ball = document.createElement("div");
        ball.classList.add("ball");
        ball.classList.add(weapons[i].toLowerCase())
        ball.innerText = weapons[i];
        ball.dataset.weapon = weapons[i];
        ball.draggable = true;
        ball.addEventListener('dragstart', startDrag);
        ball.addEventListener('dragend', endDrag);
        ballSelect.appendChild(ball);
    }
}

function startDrag(e) {
    const weapon = e.target.dataset.weapon || e.target.innerText;
    const weaponClass = (weapon || '').toLowerCase();
    e.dataTransfer.setData('text/weapon', weapon);
    e.dataTransfer.setData('text/weaponClass', weaponClass);

    if (_currentDragImage) {
        _currentDragImage.remove();
        _currentDragImage = null;
    }

    const img = e.target.cloneNode(true);
    img.style.position = 'absolute';
    img.style.top = '-9999px';
    img.style.left = '-9999px';
    img.style.pointerEvents = 'none';
    img.style.opacity = '1';
    img.style.zIndex = '999999';
    img.style.transform = 'translateZ(0)'; 
    document.body.appendChild(img);
    _currentDragImage = img;

    void img.offsetWidth;

    try {
        e.dataTransfer.setDragImage(img, Math.round(img.offsetWidth / 2), Math.round(img.offsetHeight / 2));
    } catch (err) {
        console.warn('setDragImage failed:', err);
    }
}

function endDrag(e) {
    if (_currentDragImage) {
        _currentDragImage.remove();
        _currentDragImage = null;
    }
}

function dropHandler(e) {
    e.preventDefault();
    const weapon = e.dataTransfer.getData('text/weapon');
    const weaponClass = e.dataTransfer.getData('text/weaponClass');
    const dropTarget = e.currentTarget;

    if (!weapon) return;
    if (players.includes(weapon)) return;

    if (dropTarget.classList.contains('player')) {
        weapons.forEach(w => dropTarget.classList.remove(w.toLowerCase()));
        if (weaponClass) dropTarget.classList.add(weaponClass);

        const label = dropTarget.querySelector('label');
        if (label) {
            label.innerText = weapon;
        } else {
            dropTarget.children[0].innerText = weapon;
        }

        const idx = Array.from(document.querySelectorAll('.player')).indexOf(dropTarget);
        if (idx >= 0) players[idx] = weapon;
        document.querySelectorAll('.player').forEach(p => p.classList.remove('selected'));
        dropTarget.classList.add('selected');
    }
}

function dragoverHandler(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function setupDropTargets() {
    const playersEls = document.querySelectorAll('.player');
    playersEls.forEach(p => {
        p.addEventListener('dragover', dragoverHandler);
        p.addEventListener('drop', dropHandler);
    });
    const selector = document.getElementById('selectContainer');
    selector.addEventListener('dragover', dragoverHandler);
    selector.addEventListener('drop', dropHandler);
}

window.onload = (event) => {
    generateSelector();
    setupDropTargets();
};