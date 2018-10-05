define(
    [
        'backbone',
        'underscore',
        'shared',
        'jquery',
        'ol',
        'views/search',
        'views/locate',
        'views/upload_data',
        'views/data_downloader',
        'views/spatial_filter'],
    function (Backbone, _, Shared, $, ol, SearchView, LocateView, UploadDataView, DataDownloader, SpatialFilter) {
        return Backbone.View.extend({
            template: _.template($('#map-control-panel').html()),
            locationControlActive: false,
            uploadDataActive: false,
            catchmentAreaActive: false,
            searchView: null,
            locateView: null,
            validateDataListOpen: false,
            events: {
                'click .search-control': 'searchClicked',
                'click .filter-control': 'filterClicked',
                'click .locate-control': 'locateClicked',
                'click .upload-data': 'uploadDataClicked',
                'click .map-search-close': 'closeSearchPanel',
                'click .spatial-filter-container-close': 'closeSpatialFilterPanel',
                'click .layers-selector-container-close': 'closeFilterPanel',
                'click .locate-options-container-close': 'closeLocatePanel',
                'click .sub-filter': 'closeSubFilter',
                'click .locate-coordinates': 'openLocateCoordinates',
                'click .locate-farm': 'openLocateFarm',
                'click .spatial-filter': 'spatialFilterClicked',
                'click .validate-data': 'validateDataClicked'
            },
            initialize: function (options) {
                _.bindAll(this, 'render');
                this.parent = options.parent;
                this.dataDownloaderControl = new DataDownloader({
                    parent: this
                });
                this.validateDataListOpen = false;
                Shared.Dispatcher.on('mapControlPanel:clickSpatialFilter', this.spatialFilterClicked, this);
                Shared.Dispatcher.on('mapControlPanel:validationClosed', this.validationDataClosed, this);
            },
            spatialFilterClicked: function (e) {
                if (!this.spatialFilter.isOpen()) {
                    this.resetAllControlState();
                    this.openSpatialFilterPanel();
                    this.closeSearchPanel();
                    this.closeFilterPanel();
                    this.closeLocatePanel();
                    this.closeValidateData();
                } else {
                    this.closeSpatialFilterPanel();
                }
            },
            validateDataClicked: function (e) {
                if(!this.validateDataListOpen) {
                    this.resetAllControlState();
                    this.closeSpatialFilterPanel();
                    this.closeSearchPanel();
                    this.closeFilterPanel();
                    this.closeLocatePanel();
                    this.openValidateData();
                } else {
                    this.closeValidateData();
                }
            },
            searchClicked: function (e) {
                if (!this.searchView.isOpen()) {
                    this.resetAllControlState();
                    this.openSearchPanel();
                    this.closeFilterPanel();
                    this.closeLocatePanel();
                    this.closeSpatialFilterPanel();
                    this.closeValidateData();
                } else {
                    this.closeSearchPanel();
                }
            },
            filterClicked: function (e) {
                if ($('.layers-selector-container').is(":hidden")) {
                    this.resetAllControlState();
                    this.openFilterPanel();
                    this.closeSearchPanel();
                    this.closeLocatePanel();
                    this.closeSpatialFilterPanel();
                    this.closeValidateData();
                } else {
                    this.closeFilterPanel();
                }
            },
            locateClicked: function (e) {
                if ($('.locate-options-container').is(":hidden")) {
                    this.resetAllControlState();
                    this.openLocatePanel();
                    this.closeSearchPanel();
                    this.closeFilterPanel();
                    this.closeSpatialFilterPanel();
                    this.closeValidateData();
                } else {
                    this.closeLocatePanel();
                }
            },
            uploadDataClicked: function (e) {
                var button = $(this.$el.find('.upload-data')[0]);
                if (this.uploadDataActive) {
                    button.removeClass('control-panel-selected');
                    $('#footer-message span').html('-');
                    $('#footer-message').hide();
                } else {
                    this.resetAllControlState();
                    button.addClass('control-panel-selected');
                    $('#footer-message span').html('CLICK LOCATION ON THE MAP');
                    $('#footer-message').show();
                }
                this.uploadDataActive = !this.uploadDataActive;
                this.parent.uploadDataState = this.uploadDataActive;
            },
            showUploadDataModal: function (lon, lat, siteFeature) {
                this.uploadDataView.showModal(lon, lat, siteFeature);
            },
            render: function () {
                this.$el.html(this.template());

                this.searchView = new SearchView({
                    parent: this,
                    sidePanel: this.parent.sidePanelView
                });

                this.$el.append(this.searchView.render().$el);

                this.locateView = new LocateView({
                    parent: this,
                });
                this.$el.append(this.locateView.render().$el);
                this.$el.append(
                    this.dataDownloaderControl.render().$el);
                this.$el.append(
                    this.dataDownloaderControl.renderModal());
                this.uploadDataView = new UploadDataView({
                    parent: this,
                    map: this.parent.map
                });
                this.$el.append(this.uploadDataView.render().$el);

                this.spatialFilter = new SpatialFilter({
                    parent: this,
                });

                this.$el.append(this.spatialFilter.render().$el);

                return this;
            },
            openSearchPanel: function () {
                this.$el.find('.search-control').addClass('control-panel-selected');
                this.searchView.show();
            },
            closeSearchPanel: function () {
                this.$el.find('.search-control').removeClass('control-panel-selected');
                this.searchView.hide();
            },
            openSpatialFilterPanel: function () {
                this.$el.find('.spatial-filter').addClass('control-panel-selected');
                this.spatialFilter.show();
            },
            closeSpatialFilterPanel: function () {
                this.$el.find('.spatial-filter').removeClass('control-panel-selected');
                this.spatialFilter.hide();
            },
            closeValidateData: function () {
                this.$el.find('.validate-data').removeClass('control-panel-selected');
                Shared.Dispatcher.trigger('sidePanel:closeValidateDataList');
                this.validateDataListOpen = false;
            },
            validationDataClosed: function () {
                this.$el.find('.validate-data').removeClass('control-panel-selected');
                this.validateDataListOpen = false;
            },
            openValidateData: function () {
                this.$el.find('.validate-data').addClass('control-panel-selected');
                Shared.Dispatcher.trigger('sidePanel:openValidateDataList');
                this.validateDataListOpen = true;
            },
            closeSubFilter: function (e) {
                var target = $(e.target);
                var $wrapper = target.closest('.sub-filter');
                $wrapper.next().toggle();
                $wrapper.find('.filter-icon-arrow').toggle();
            },
            openFilterPanel: function () {
                this.$el.find('.filter-control').addClass('control-panel-selected');
                $('.layers-selector-container').show();
            },
            closeFilterPanel: function () {
                this.$el.find('.filter-control').removeClass('control-panel-selected');
                $('.layers-selector-container').hide();
            },
            openLocatePanel: function () {
                this.$el.find('.locate-control').addClass('control-panel-selected');
                $('.locate-options-container').show();
            },
            closeLocatePanel: function () {
                this.$el.find('.locate-control').removeClass('control-panel-selected');
                $('.locate-options-container').hide();
            },
            openLocateCoordinates: function (e) {
                this.closeLocatePanel();
                this.locateView.showModal('.coordinate-form');
            },
            openLocateFarm: function (e) {
                this.closeLocatePanel();
                this.locateView.showModal('.farm-form');
            },
            resetAllControlState: function () {
                $('#download-control-modal').hide();
                var uploadDataElm = this.$el.find('.upload-data');
                if (uploadDataElm.hasClass('control-panel-selected')) {
                    uploadDataElm.removeClass('control-panel-selected');
                    this.uploadDataActive = false;
                    $('#footer-message span').html('-');
                    $('#footer-message').hide();
                    this.parent.uploadDataState = false;
                }

                $('.layer-switcher.shown button').click();
                $('.map-control-panel-box:visible').hide();
                $('.sub-control-panel.control-panel-selected').removeClass('control-panel-selected');
            }
        })
    });
