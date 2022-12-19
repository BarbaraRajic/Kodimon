/* UI CLASS */

class UIcontroller {
    constructor() {
        this.logs = [];
    }

    pokemonData(data, side) {
        // Set game box
        this.gameBox();
        // Display pokemon data
        this.resetBarBox(side);
        this.pokemonName(data, side);
        this.pokemonPicture(data, side);
        this.pokemonStats(data, side);
    }

    resetBarBox(side) {
        this.percentageFix(100, side);
        this.hpBarFix(100, side);
    }

    pokemonName(data, side) {
        const name = document.querySelector(this.checkSide("name", side));
        name.innerHTML = data.name;
    }

    pokemonPicture(data, side) {
        const picture = document.querySelector(this.checkSide("picture", side));
        picture.src = data.picture;
        picture.alt = data.name;
    }

    pokemonStats(data, side) {
        const stats = document.querySelector(this.checkSide("stats", side));
        // Clear stats
        stats.innerHTML = '';
        // Helper variables
        const dataArr = [data.hp, data.attack, data.deffense, data.speed];
        const keys = Object.keys(data);
        // Create Stats list
        for(let i = 0; i < dataArr.length; i++) {
            let li = document.createElement("li");

            let text = document.createTextNode(`${keys[i]}: ${dataArr[i]}`);
            li.appendChild(text);
            stats.appendChild(li);
        }
    }

    gameBox() {
        // Get game box
        document.querySelector(".game_box").style.display = "grid";
        // Remove Home Box
        document.querySelector(".home_box").style.display = "none";
        // Set buttons in place
        this.returnArrow();
        this.gameMenuStyle();
        // Clear
        this.winnerRemove();
    }

    homeBox() {
        // Set buttons in place
        this.returnArrow();
        this.gameMenuStyle();
        // Get home box
        document.querySelector(".home_box").style.display = "block";
        // Remove Game Box
        document.querySelector(".game_box").style.display = "none";
    }

    endStyle(percentage, side, name) {
        this.removeArrow();
        this.endMenuStyle();
        this.hpBarFix(percentage, side);
        this.percentageFix(percentage, side);
        this.winnerDisplay(name);
    }

    battleStyle(percentage, side) {
        this.hpBarFix(percentage, side);
        this.percentageFix(percentage, side);
        // Turn arrow in opposite direction 
        side === "right" ? this.rotateArrow("left") : this.rotateArrow("right");
    }

    hpBarFix(percentage, side) {
        const barStyle = document.querySelector(this.checkSide("bar", side)).style;
        const progressStyle = document.querySelector(this.checkSide("progress", side)).style;
        // Change bar width
        barStyle.width = "" + percentage + "%";
        // Change bar colors
        if(percentage > 50) {
            barStyle.backgroundColor = "#62FF84";
            progressStyle.outline = "medium solid #079325";
        }else {
            barStyle.backgroundColor = "#FF7575";
            progressStyle.outline = "medium solid #cf1616";
        }
    }

    percentageFix(percentage, side) {
        const percentageStyle = document.querySelector(this.checkSide("percentage", side));
        // Display new percentage
        percentageStyle.innerHTML = "" + percentage + "%";
        // Change percentage colors
        if(percentage > 50) {
            percentageStyle.style.color = "#079325";
        }else {
            percentageStyle.style.color = "#cf1616";
        }
    }

    rotateArrow(side) {
        if(side === "right") {
            document.querySelector(".attack_arrow").style.transform = "rotateY(180deg)";
        }else{
            document.querySelector(".attack_arrow").style.transform = "rotateY(0deg)";
        }
    }

    endMenuStyle() {
        document.querySelector(".menu_box").classList.add("end_menu_box");
    }

    gameMenuStyle() {
        document.querySelector(".menu_box").classList.remove("end_menu_box");
    }

    removeArrow() {
        document.querySelector(".attack_box").style.display = "none";
    }

    returnArrow() {
        document.querySelector(".attack_box").style.display = "";
    }

    winnerDisplay(name) {
        // Display which pokemon won the game
        const winnerP = document.createElement("p");
        winnerP.classList.add("winner");
        const winnerContent = document.createTextNode(`${name} won!`);
        winnerP.appendChild(winnerContent);
        const gameBox = this.getGameBox()
        gameBox.appendChild(winnerP);
    }

    winnerRemove() {
        const winner = document.querySelector(".winner");
        if(winner){
            this.getGameBox().removeChild(winner);
        }
    }

    winnerPrint(name) {
        this.logs.push(`${name} died`);
    }

    demagePrint(name, opponentName, opponentHpLost) {
        this.logs.push(`${name} attacked ${opponentName} for ${opponentHpLost} dmg`);
    }

    missPrint(name, opponentName) {
        this.logs.push(`${name} missed ${opponentName}`);
    }

    checkSide(className, side) {
        return "." + className + "_" + side;
    }

    homeBtn() {
        return document.querySelector(".home_btn");
    }

    gameBtn() {
        return document.querySelector(".game_btn");
    }

    frontBtn() {
        return document.querySelector(".front_btn");
    }

    getGameBox() {
        return document.querySelector(".game_box");
    }

    logsDisplay() {
        const logs = document.querySelector(".logs");
        // Create Logs
        let li = document.createElement("li");
        // Display last element from this.logs
        let text = document.createTextNode(`${this.logs[this.logs.length - 1]}`);
        li.appendChild(text);
        logs.appendChild(li);
    }

    clearLogs() {
        this.logs = [];
        const logs = document.querySelector(".logs");
        while(logs.firstChild) logs.removeChild(logs.firstChild);
    }
}

/* POKEMON CLASS */

class Pokemon {
    constructor () {
        this.hp,
        this.attack,
        this.deffense,
        this.speed,
        this.name,
        this.picture,
        this.percentage = 100;
        this.hpLost;
    }

    async fetchPokemon (id) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

        return await response.json();
    }

    async set () {
        this.data = await this.fetchPokemon(this.random());
        this.name = this.nameFix(this.data.name);
        this.hp = this.data.stats[0].base_stat;
        this.attack = this.data.stats[1].base_stat;
        this.deffense = this.data.stats[2].base_stat;
        this.speed = this.data.stats[5].base_stat;
        this.picture = this.data.sprites.other.dream_world.front_default;
    }

    get() {
        return {
            hp: this.hp,
            attack: this.attack,
            deffense: this.deffense,
            speed: this.speed,
            name: this.name,
            picture: this.picture,
            percentage: this.percentage,
            hpLost: this.hpLost
        }
    }

    miss () {
        const chance = Math.floor(Math.random() * 10)
        // 20% chance to miss 
        return (chance < 2) ? true : false;
    }

    percentageFix (enemyAttack) {
        const attack = +(enemyAttack / 2).toFixed(2);
        // HP lost
        let lost = (attack) - (this.deffense / 100 * attack);
        lost = +lost.toFixed(2);
        // If deffence is much higher than enemy's attack - no damage recived
        if(lost <= 0) {
            lost = 0;
            this.hpLost = lost;
            return
        }

        this.hpLost = lost;
        this.percentage = Math.round(this.percentage - (100 * lost / this.hp));
    }

    lost() {
        // Set percentage to zero for display
        if(this.percentage <= 0) {
            this.percentage = 0;
            return true;
        }
        return false;
    }

    random () {
        // Choose random pokemon
        return Math.floor(Math.random() * (150 - 1 + 1) + 1)
    }

    nameFix(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
}

/*GAME CLASS*/

class Game {
    constructor() {
        this.pL;
        this.pR;
        this.side = "";
        this.ui = new UIcontroller;

        this.ui.frontBtn().addEventListener('click', () => {
            this.newGame()
        })

        this.ui.getGameBox().addEventListener('click', (event) => {
            const button = event.target.className;

            if(this.checkBtn(button, /home/)) {
                this.ui.homeBox()
            }else if (this.checkBtn(button, /game/)) {
                this.newGame()
            }else if (this.checkBtn(button, /attack/)) {
                this.battle()
            }
        })
    }

    async getPokemonData(pokemon) {
        await pokemon.set();
        const data = pokemon.get();

        return data;
    }

    async newGame() {
        // Create new pokemons
        this.pL = new Pokemon();
        this.pR = new Pokemon();
        // Get pokemons' data
        const left = await this.getPokemonData(this.pL);
        const right = await this.getPokemonData(this.pR);
        // UI
        // Display data
        this.ui.pokemonData(left, "left")
        this.ui.pokemonData(right, "right")
        // Display arrow
        this.ui.rotateArrow(this.sideAttacks())
        // Clear logs
        this.ui.clearLogs()
    }

    battle() {
        if(this.side === "right") { // If left pokemon attacks create new styles for right pokemon
            if(this.pL.miss()) {
                this.missDisplay(this.pL.get(), this.pR.get());
                return
            }
            
            this.pR.percentageFix(this.pL.get().attack);
            this.damageDisplay(this.pL.get(),this.pR.get());

            if(this.pR.lost()) {
                this.lostDisplay(this.pR.get(), this.pL.get());
                return
            }

            this.ui.battleStyle(this.pR.get().percentage, this.side);
            this.sideAttacks();
        }else { // If right pokemon attacks create new styles for left pokemon
            if(this.pR.miss()) {
                this.missDisplay(this.pR.get(), this.pL.get());
                return
            }
            
            this.pL.percentageFix(this.pR.get().attack);
            this.damageDisplay(this.pR.get(), this.pL.get());

            if(this.pL.lost()) {
                this.lostDisplay(this.pL.get(), this.pR.get());
                return
            } 
            this.ui.battleStyle(this.pL.get().percentage, this.side);
            this.sideAttacks();
        }
    }

    damageDisplay(pOne, pTwo) {
        this.ui.demagePrint(pOne.name, pTwo.name, pTwo.hpLost);
        this.ui.logsDisplay()
    }

    missDisplay(pOne, pTwo) {
        this.ui.missPrint(pOne.name, pTwo.name);
        this.ui.logsDisplay();
        this.ui.rotateArrow(this.sideAttacks());
    }

    lostDisplay(pOne, pTwo) {
        this.ui.endStyle(pOne.percentage, this.side, pTwo.name);
        this.ui.winnerPrint(pOne.name);
        this.ui.logsDisplay();
        this.resetSide();
    }

    sideAttacks() {
        if(this.side.length === 0) {
            this.pR.hp < this.pL.hp ? this.side = "right" : this.side = "left";
        }else if(this.side === "right") {
            this.side = "left";
        }else {
            this.side = "right";
        }

        return this.side;
    }

    resetSide() {
        this.side = "";
    }

    checkBtn(button, regex) {
        return regex.test(button)
    }
}

const game = new Game()