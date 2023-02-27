import AppMethods from './utils/AppMethods.js';

export default class App extends AppMethods {
    constructor(onWindow, game, verbose = true) {
        super(game, verbose);
        onWindow && (window.app = this);
    }
}