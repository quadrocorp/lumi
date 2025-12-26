class BotBreeder {
    constructor (persistent, id) {
        this.persistent = persistent;
        this.id = id;
        this.bots = {};
    }
    saveToJSON() {
        if (this.persistent) {
            
        }
    }
    generate(amount) {

    }
}

class BotBreather {
    constructor (bots) {
        this.bots = bots
    }
}

export {
    BotBreather,
    BotBreeder
}