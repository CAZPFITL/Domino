import GameLevel from "./utils/components/GameLevel.js";
import Gui from "./utils/gui/Gui.js";
import States from "../../engine/utils/patterns/State.js";
import Player from "./utils/components/Player.js";
// import Maps from "./utils/gui/Maps.js";
import {
    STATES,
    gameFlags,
    // gameSongs,
    // mainSong
} from "./env.js";

export default class Domino {
    constructor(app, loadCallback) {
        this.app = app;
        this.useMusicBox = false;
        this.loadCallback = loadCallback;

        this.gui = new Gui(this.app, this);
        this.app.factory.addGameEntity(this.gui);

        this.flags = gameFlags;
        this.state = new States(app, this, 'LOAD_GAME_DATA', STATES);
        this.app.factory.addGameEntity(this);
    }

    /**
     * Private methods
     */
    #loadData() {
        // Load Player Controls
        this.app.player = new Player(this.app, this);
        // // Load Music Box
        this.useMusicBox && this.app.musicBox.addSong(gameSongs);
        // Load Main song
        this.useMusicBox && this.app.musicBox.changeSong(mainSong);
        this.useMusicBox && this.app.musicBox.autoplay();
        // load Controls listeners
        this.app.controls.addListeners();
        // Set State to LOAD_GAME_LEVEL
        this.state.setState('MAIN_MENU');
        // update gravity to zero
        this.app.physics.engine.gravity = {
            "x": 0,
            "y": 0,
            "scale": 0.1
        }
    }

    #loadGameLevel() {
        if (!this.loadCache) {
            setTimeout(()=>{
                this.level = new GameLevel({
                    app,
                    game: this
                })
                this.app.camera.zoom = this.app.camera.refZoom;
                this.state.setState('PLAY_GAME');
               this.loadCache = false
            }, 100)
            this.loadCache = true
        }
    }

    #restart() {
        this.app.factory.binnacle = {GameObjects: this.app.factory.binnacle.GameObjects};
        this.#loadGameLevel();
    }

    /**
     * Draw and Update methods
     */
    update() {
        (this.state.state === 'LOAD_GAME_DATA') && this.#loadData();
        (this.state.state === 'LOADING') && this.#loadGameLevel();
    }
}