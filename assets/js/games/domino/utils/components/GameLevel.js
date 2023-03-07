import {GAME_OVER, PLAY_GAME} from "../../env.js";
import Domino, {dominoSize} from '../entities/Domino.js'
import Board from '../entities/Board.js'

export default class GameLevel {
    constructor({app, game, addedRules = []}) {
        this.app = app;
        this.game = game;
        this.addedRules = addedRules;
        this.classes = {
            Domino,
            Board,
        }
        this.loadEntitiesList = [
            ...this.getDominoes(),
            {
                name: 'Board',
                props: {
                    app: this.app,
                }
            }
        ];
        this.load('entities');
        this.app.factory.addGameEntity(this);
    }

    /**
     * Load methods
     */
    load(type) {
        if (type === 'entities') {
            for (let entity of this?.loadEntitiesList) {
                entity?.name && this.app.factory.create(this.classes[entity.name], entity.props);
            }
        }
        if (type === 'rules') {
            for (let rule of this.addedRules) {
                if (this.app.factory.binnacle[rule.name]) {
                    this.app.factory.binnacle[rule.name].forEach(entity => {
                        if (entity instanceof Array) return;
                        rule?.rule(entity);
                    })
                }
            }
        }
    }

    /*
     * Game methods
     */
    getDominoes(base = [1]) {
        const output = [];
        let idCounter = 0;
        base.forEach((a) => {
            base.forEach((b) => {
                output.push({
                    name: 'Domino',
                    props: {
                        id: idCounter,
                        app: this.app,
                        coords: {
                            x: (a * (dominoSize.width + 10)),
                            y: (b * (dominoSize.height + 10)) - 200,
                        }, value: [a, b]
                    }
                });
                ++idCounter
            })
        })
        return output;
    }

    update() {
        this.load('rules');
    }

    /**
     * Draw and Update methods
     */
    draw() {
        if (this.app.game.state.state === PLAY_GAME ||
            this.app.game.state.state === GAME_OVER) {
            // TODO change this to get the level
            // this.app.gui.ctx.fillStyle = this.color;
            // this.app.gui.ctx.fillRect(this.coords.x, this.coords.y, this.size.width, this.size.height);
        }
    }
}