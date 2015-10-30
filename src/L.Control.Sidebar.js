L.Control.Sidebar = L.Control.extend({

    includes: L.Mixin.Events,

    options: {
        toggleButton: true,
        position: 'left'
    },

    initialize: function (placeholder, options) {
        L.setOptions(this, options);

        // Find content container
        var content = this._contentContainer = L.DomUtil.get(placeholder);

        // Remove the content container from its original parent
        content.parentNode.removeChild(content);

        var l = 'leaflet-';

        // Create sidebar container
        var container = this._container =
            L.DomUtil.create('div', l + 'sidebar ' + this.options.position);

        // Style and attach content container
        L.DomUtil.addClass(content, l + 'control');
        container.appendChild(content);

        // Create close button and attach it if configured
        if (this.options.toggleButton) {
            var toggle = this._toggleButton =
                L.DomUtil.create('div', '', container);
                var tagglediv=this._tagglediv=  L.DomUtil.create('div', 'mapinfo_but mapinfo_but_open', toggle);
                tagglediv.innerHTML = '<div class="mapinfo_but_con">'+
															'<div class="mapinfo_but_div">'+
															'<span class="mapinfo_but_span"></span></div></div>';
        }
    },
    addTo: function (map) {
        var container = this._container;
        var content = this._contentContainer;

        // Attach event to close button
        if (this.options.toggleButton) {
            var toggle = this._toggleButton;

            L.DomEvent.on(toggle, 'click', this.toggle, this);
        }

        // Attach sidebar container to controls container
        var controlContainer = map._controlContainer;
        controlContainer.insertBefore(container, controlContainer.firstChild);

        this._map = map;

        // Make sure we don't drag the map when we interact with the content
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent
            .on(content, 'click', stop)
            .on(content, 'mousedown', stop)
            .on(content, 'touchstart', stop)
            .on(content, 'dblclick', stop)
            .on(content, 'mousewheel', stop)
            .on(content, 'MozMousePixelScroll', stop);

        return this;
    },

    removeFrom: function (map) {
        //if the control is visible, hide it before removing it.
        this.hide();

        var content = this._contentContainer;

        // Remove sidebar container from controls container
        var controlContainer = map._controlContainer;
        controlContainer.removeChild(this._container);

        //disassociate the map object
        this._map = null;

        // Unregister events to prevent memory leak
        var stop = L.DomEvent.stopPropagation;
        L.DomEvent
            .off(content, 'click', stop)
            .off(content, 'mousedown', stop)
            .off(content, 'touchstart', stop)
            .off(content, 'dblclick', stop)
            .off(content, 'mousewheel', stop)
            .off(content, 'MozMousePixelScroll', stop);

        if (this._toggleButton && this._close) {
            var toggle = this._toggleButton;

            L.DomEvent.off(toggle, 'click', this.toggle, this);
        }

        return this;
    },

    isVisible: function () {
        return L.DomUtil.hasClass(this._container, 'visible');
    },

    show: function () {
        if (!this.isVisible()) {
            L.DomUtil.addClass(this._container, 'visible');
             L.DomUtil.removeClass(this._tagglediv, 'mapinfo_but_open');
            this._map.panBy([-this.getOffset() / 2, 0], {
                duration: 0.5
            });
            this.fire('show');
        }
    },

    hide: function (e) {
        if (this.isVisible()) {
            L.DomUtil.removeClass(this._container, 'visible');
             L.DomUtil.addClass(this._tagglediv, 'mapinfo_but_open');
            this._map.panBy([this.getOffset() / 2, 0], {
                duration: 0.5
            });
            this.fire('hide');
        }
        if(e) {
            L.DomEvent.stopPropagation(e);
        }
    },

    toggle: function () {
        if (this.isVisible()) {
            this.hide();
        } else {
            this.show();
        }
    },

    getContainer: function () {
        return this._contentContainer;
    },

    getToggleButton: function () {
        return this._toggleButton;
    },

    setContent: function (content) {
        this.getContainer().innerHTML = content;
        return this;
    },

    getOffset: function () {
        if (this.options.position === 'right') {
            return -this._container.offsetWidth;
        } else {
            return this._container.offsetWidth;
        }
    }
});

L.control.sidebar = function (placeholder, options) {
    return new L.Control.Sidebar(placeholder, options);
};