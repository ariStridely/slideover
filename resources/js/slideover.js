window.LivewireUISlideover = () => {
    return {
        isEnabled: false,
        activeComponents: [],
        visibleComponents: [],
        foregroundComponentId: null,
        closingComponentId: null,
        transitionDuration: 500,

        closeSlideover(force = false, skipPreviousSlideovers = 0, destroySkipped = false) {
            // console.log('closeSlideover');

            if (!this.isEnabled) {
                return;
            }
            if (!this.foregroundComponentId) {
                return;
            }

            this.closingComponentId = this.visibleComponents.pop();

            if (this.getComponentAttributeById(this.foregroundComponentId, 'dispatchSlideoverCloseEvent') === true) {
                const componentName = this.$wire.get('components')[this.foregroundComponentId].name;
                Livewire.emit('slideoverClosed', componentName);
            }

            if (this.getComponentAttributeById(this.closingComponentId, 'destroySlideoverOnClose') === true) {
                setTimeout(() => {
                    Livewire.emit('destroySlideover', this.closingComponentId);
                }, this.transitionDuration);
            }

            this.foregroundComponentId = null;

            let previousVisibleComponentId = this.visibleComponents[this.visibleComponents.length - 1];
            previousVisibleComponentId ? this.openComponent(previousVisibleComponentId) : this.closeAll();

            this.trashClosingActiveComponent();
        },

        trashClosingActiveComponent() {
            // The closing one which is the last in the array
            setTimeout(() => {
                this.activeComponents.pop();
            }, this.transitionDuration);
        },

        trashActiveComponent(trashingId) {
            setTimeout(() => {
                this.activeComponents = this.activeComponents.filter(id => id != trashingId);
            }, this.transitionDuration);
        },

        openComponent(componentId) {
            setTimeout(() => {
                this.foregroundComponentId = componentId;
            }, 300);
        },

        closeAll() {
            setTimeout(() => {
                this.foregroundComponentId = null;
                this.closingComponentId = null;
                this.$wire.resetState();
            }, this.transitionDuration);

            this.disable();
        },

        getComponentIdByIndex(index) {
            if (this.activeComponents[index] !== undefined) {
                return this.activeComponents[index]['id'];
            }
        },

        getComponentAttributeById(id, key) {
            if (this.$wire.get('components')[id] !== undefined) {
                return this.$wire.get('components')[id]['slideoverAttributes'][key];
            }
        },

        enable() {
            this.isEnabled = true;

            document.getElementsByTagName('html')[0].classList.add('overflow-y-hidden');
        },

        disable() {
            this.isEnabled = false;

            document.getElementsByTagName('html')[0].classList.remove('overflow-y-hidden');
        },

        closeSlideoverOnEscape(trigger) {
            if (this.getComponentAttributeById(this.foregroundComponentId, 'slideoverCloseOnEscape') === false) {
                return;
            }

            let force = this.getComponentAttributeById(this.foregroundComponentId, 'slideoverCloseOnEscapeIsForceful') === true;
            this.closeSlideover(force);
        },

        closeSlideoverOnClickAway(trigger) {
            if (this.getComponentAttributeById(this.foregroundComponentId, 'slideoverCloseOnClickAway') === false) {
                return;
            }

            this.closeSlideover(true);
        },

        addActiveComponent(id, skip = false) {
            // console.log('addActiveComponent', id);

            if (!this.isEnabled) {
                this.enable();
            }

            if (this.visibleComponents.includes(id)) {
                return;
            }

            this.visibleComponents.push(id);
            this.activeComponents.push(id);
            this.foregroundComponentId = id;
        },

        init() {
            Livewire.on('closeSlideover', (force = false, skipPreviousSlideovers = 0, destroySkipped = false) => {
                // console.log('init@closeSlideover');
                this.closeSlideover(force, skipPreviousSlideovers, destroySkipped);
            });

            Livewire.on('activeSlideoverComponentChanged', id => {
                // console.log('init@activeSlideoverComponentChanged');
                this.addActiveComponent(id);
            });
        },
    };
};
