import {GAME_OVER, PLAY} from "../../env.js";
import Domino from '../entities/Domino.js'
import {dominoSize} from '../entities/Domino'
export default class GameLevel {
    constructor({app, game, addedRules}) {
        this.app = app;
        this.game = game;
        this.coords = {x: -2000 / 2, y: -1000 / 2};
        this.size = {width: 2000, height: 1000}
        this.color = '#523f32';
        this.addedRules = addedRules;
        this.map = null;

        this.loadEntitiesList = this.game.constructor.name === 'Domino' && [
            ...this.getDominoes()
        ];
        this.game.constructor.name === 'Domino' && this.loadEntities();
        this.app.factory.addGameEntity(this);
    }

    getDominoes(base = [1,2,3,4,5,6]) {
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
                            x: (a * dominoSize.width + 5),
                            y: (b * dominoSize.height + 5),
                        }, value: [a, b]
                    }
                });
                ++idCounter
            })
        })
        return output;
    }

    /**
     * Load methods
     */
    loadEntities() {
        for (let entity of this?.loadEntitiesList) {
            entity?.name && this[entity.name](entity.props);
        }
    }

    // #loadOutsideRules() {
    //     for (let rule of this.addedRules) {
    //         if (this.app.factory.binnacle[rule.name]) {
    //             this.app.factory.binnacle[rule.name].forEach(entity => {
    //                 if (entity instanceof Array) return;
    //                 rule?.rule(entity);
    //             })
    //         }
    //     }
    // }

    Domino(props) {
        this.app.factory.create(Domino, props);
    }

    update() {
        // this.#getBordersEdges();
        // this.#loadOutsideRules();
    }

    /**
     * Draw and Update methods
     */
    draw() {
        if (this.app.game.state.state === PLAY ||
          this.app.game.state.state === GAME_OVER) {
            // TODO change this to get the level
            this.app.gui.ctx.fillStyle = this.color;
            this.app.gui.ctx.fillRect(this.coords.x, this.coords.y, this.size.width, this.size.height);
        }
    }
}