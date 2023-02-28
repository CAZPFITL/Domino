export default class Player {
    constructor(app, game) {
        this.app = app;
        this.game = game;
        this.controls = this.app.game.constructor.name === 'Domino'
            ? {
                pick: 0,
                drop: 0,
            } : false;
        this.#addListeners();
    }

    /**
     * Private methods TODO MOVE THIS TO SCREEN
     */
    #addListeners() {
        // Change Controlled Entity
        this.app.controls.pushListener(this, 'click', (/*event*/) => {
            // const coords = this.app.gui.get.clickCoords(event, this.app.camera.viewport);
            // const ant = this.app.gui.get.entityAt(coords, this.app.factory.binnacle.Ant);
        });
        // Move Player Down events
        this.app.controls.pushListener(this, 'keydown', (event) => {
            switch (true) {
                case event.key === 'q' && this.app.game.constructor.name === 'Domino':
                    this.controls.drop = 1;
                    break;
                case event.key === ' ' && this.app.game.constructor.name === 'Domino':
                    this.controls.pick = 1;
                    break;
            }
        });
        // Move Player Up Events
        this.app.controls.pushListener(this, 'keyup', (event) => {
            switch (true) {
                case event.key === 'q' && this.app.game.constructor.name === 'Domino':
                    this.controls.drop = 0;
                    break;
                case event.key === ' ' && this.app.game.constructor.name === 'Domino':
                    this.controls.pick = 0;
                    break;
            }
        });
    }
}