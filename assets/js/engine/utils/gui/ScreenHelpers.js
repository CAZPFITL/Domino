class ScreenHelpers {

    addListeners(abstractEvents) {
        this.app.controls.pushListener(this, 'mousemove', (event) => {
            const buttons = this.getButtons()
            const hoverTranslatedCoords = this.app.gui.get.viewportCoords({
                x: event.offsetX,
                y: event.offsetY
            }, this.app.camera.viewport);

            // this.app.player.anthill.target = hoverTranslatedCoords;

            // ABSTRACT MOVE
            abstractEvents.mousemove(event, hoverTranslatedCoords);
            // MOUSE MOVE
            Object.keys(buttons).forEach((key) =>
                buttons[key].props?.callbacks?.mousemove &&
                buttons[key].props.callbacks.mousemove(event, hoverTranslatedCoords));
            // HOVER READ
            this.app.gui.get.checkHoverCollection({
                collection: this.hoverCollection,
                event,
                viewport: this.app.camera.viewport,
                isHover: (key) => {
                    if (this.buttonsStates[key] !== 'click' && this.buttonsStates[key] !== 'hover') {
                        this.buttonsStates[key] = 'hover';
                        this.hoverCaller = key;
                        this.gui.hoverStateIn();
                    }
                },
                isOut: (key) => {
                    if (this.buttonsStates[key] !== 'click' && this.buttonsStates[key] !== 'normal') {
                        this.buttonsStates[key] = 'normal';
                        this.hoverCaller = null;
                        this.gui.hoverStateOut();
                    }
                },
                caller: this.hoverCaller,
            });
        });
        this.app.controls.pushListener(this, 'mouseup', (event) => {
            const buttons = this.getButtons()
            Object.keys(buttons).forEach((key) => {
                const ctx = buttons[key].props.position === 'viewport'
                    ? this.app.gui.get.clickCoords(event, this.app.camera.viewport)
                    : {x: event.offsetX, y: event.offsetY};

                this.app.gui.get.isClicked(
                    buttons[key].props,
                    ctx,
                    () => buttons[key].props?.callbacks?.mouseup && buttons[key].props.callbacks.mouseup(event)
                )
            });
            abstractEvents.mouseup(event);
        });
        this.app.controls.pushListener(this, 'mousedown', (event) => {
            const buttons = this.getButtons()

            Object.keys(buttons).forEach((key) => {
                if (!buttons[key].props?.ctx) return;
                const ctx = buttons[key].props.position === 'viewport'
                    ? this.app.gui.get.clickCoords(event, this.app.camera.viewport)
                    : {x: event.offsetX, y: event.offsetY};

                this.app.gui.get.isClicked(
                    buttons[key].props,
                    ctx,
                    () => buttons[key].props?.callbacks?.mousedown && buttons[key].props.callbacks.mousedown(event)
                )
            });
            abstractEvents.mousedown(event);
        });
        this.app.controls.pushListener(this, 'click', (event) => {
            const buttons = this.getButtons()

            Object.keys(buttons).forEach((key) => {
                const ctx = buttons[key].props.position === 'viewport'
                    ? this.app.gui.get.clickCoords(event, this.app.camera.viewport)
                    : {x: event.offsetX, y: event.offsetY};

                this.app.gui.get.isClicked(
                    buttons[key].props,
                    ctx,
                    () => buttons[key].props?.callbacks?.click && buttons[key].props.callbacks.click(event)
                )
            });

            abstractEvents.click(event);
        });
    }

    getButtons() {
        const output = {};
        Object.entries(this.buttonsCollection).forEach(key => {
            if (key[0] !== this.app.game.state.state) return;
            Object.entries(key[1]).forEach(button => output[button[0]] = button[1]);
        })
        return output;
    }

    update() {
        this.screenData();
    }

    draw() {
        // DECLARE COLLECTION
        const collection = [
            ...Object.values(this?.decorations[this?.app?.game?.state?.state] ?? {}),
            ...Object.values(this?.buttonsCollection[this?.app?.game?.state?.state] ?? {}),
        ];
        // DRAW COLLECTION
        for (let i = 0; i < collection.length; i++) {
            try {
                const item = collection[i];
                if (typeof this?.app?.gui?.get[item?.type] === 'function') {
                    this.app.gui.get[item.type](item.props);
                }
            } catch (error) {
                console.error(
                    'verify item.props are provided with next keys:' +
                    'position, ctx, x, y, width, height, text, font, bg, stroke, widthStroke, callbacks' +
                    error
                );
                debugger;
            }
        }
        // CLEAR HOVER COLLECTION
        this.hoverCollection = {};
        // HOVER EVENTS
        Object.entries(this.buttonsCollection[this.app.game.state.state] ?? {}).forEach(key => {
            this.hoverCollection[key[0]] = key[1].props;
        });
        // CANVAS BACKGROUND
        if (!this?.colors[this?.app?.game?.state?.state]?.background) return;

        this.app.gui.ctx.canvas.style.backgroundColor = this.colors[this.app.game.state.state].background;
    }
}

export default ScreenHelpers