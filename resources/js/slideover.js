window.LivewireUISlideover = () => {
    return {
        isEnabled: false,
        activeComponentsIds: [],
        visibleComponentsIds: [],
        foregroundComponentId: null,
        closingComponentId: null,
        transitionDuration: 500,

        closeSlideover(force = false, skipPreviousSlideovers = 0, destroySkipped = false) {
            if (!this.isEnabled) {
                return;
            }
            if (!this.foregroundComponentId) {
                return;
            }

            this.closingComponentId = this.visibleComponentsIds.pop();

            if (this.getComponentAttributeById(this.foregroundComponentId, 'dispatchSlideoverCloseEvent') === true) {
                const componentName = this.$wire.get('components')[this.foregroundComponentId].name;
                Livewire.dispatch('slideoverClosed', { componentName: componentName });
            }

            if (this.getComponentAttributeById(this.closingComponentId, 'destroySlideoverOnClose') === true) {
                setTimeout(() => {
                    Livewire.dispatch('destroySlideover', { id: this.closingComponentId });
                }, this.transitionDuration);
            }

            this.foregroundComponentId = null;

            let previousVisibleComponentId = this.visibleComponentsIds[this.visibleComponentsIds.length - 1];
            previousVisibleComponentId ? this.openComponent(previousVisibleComponentId) : this.closeAll();

            this.trashClosingActiveComponent();
        },

        trashClosingActiveComponent() {
            // The closing one which is the last in the array
            setTimeout(() => {
                this.activeComponentsIds.pop();
            }, this.transitionDuration);
        },

        trashActiveComponent(trashingId) {
            setTimeout(() => {
                this.activeComponentsIds = this.activeComponentsIds.filter(id => id != trashingId);
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

        /**
         * Returns the component id by its position in the array.
         */
        getComponentIdByIndex(index) {
            if (this.activeComponentsIds[index] !== undefined) {
                return this.activeComponentsIds[index];
            }
        },

        /**
         * Retrieves a key from the component slideoverAttributes
         */
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

        closeSlideoverOnClickAway(trigger) {
            if (this.getComponentAttributeById(this.foregroundComponentId, 'closeSlideoverOnClickAway') === false) {
                return;
            }

            this.closeSlideover(true);
        },

        closeSlideoverOnEscape(trigger) {
            if (this.getComponentAttributeById(this.foregroundComponentId, 'closeSlideoverOnEscape') === false) {
                return;
            }

            let force = this.getComponentAttributeById(this.foregroundComponentId, 'closeSlideoverOnEscapeIsForceful') === true;
            this.closeSlideover(force);
        },

        /**
         * Handles a new slideover opened.
         */
        addActiveComponent(id, skip = false) {
            // console.log('addActiveComponent', id);

            if (!this.isEnabled) {
                this.enable();
            }

            if (this.visibleComponentsIds.includes(id)) {
                return;
            }

            this.visibleComponentsIds.push(id);
            this.activeComponentsIds.push(id);
            this.foregroundComponentId = id;
        },

        /**
         * Init the component and register listeners on closing and opening a slideover.
         */
        init() {
            Livewire.on('closeSlideover', (force = false, skipPreviousSlideovers = 0, destroySkipped = false) => {
                // console.log('init@closeSlideover');
                this.closeSlideover(force, skipPreviousSlideovers, destroySkipped);
            });

            // triggered in Slideover.php when a new slideover is opened.
            Livewire.on('activeSlideoverComponentChanged', component => {
                // console.log('init@activeSlideoverComponentChanged');
                this.addActiveComponent(component['id']);
            });
        },
    };
};
