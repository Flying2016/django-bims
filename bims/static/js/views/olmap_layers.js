define(['backbone', 'underscore', 'jquery', 'ol', 'views/layer_style'], function (Backbone, _, $, ol, LayerStyle) {
    return Backbone.View.extend({
        nonBiodiversityLayersInitiation: {
            '2012 Vegetation Map of South Africa, Lesotho and Swaziland': new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://lbimsgis.kartoza.com/geoserver/wms',
                    params: {
                        'layers': 'geonode:vegetation_map_2012',
                        'format': 'image/png'
                    }
                })
            }),
            'South Africa Towns': new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://lbimsgis.kartoza.com/geoserver/wms',
                    params: {
                        'layers': 'geonode:sa_towns',
                        'format': 'image/png'
                    }
                })
            }),
            'Biomes of South Africa': new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://lbimsgis.kartoza.com/geoserver/wms',
                    params: {
                        'layers': 'geonode:biomes_of_south_africa_dea_csir',
                        'format': 'image/png'
                    }
                })
            }),
            'South Africa Dams Polygon': new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://lbimsgis.kartoza.com/geoserver/wms',
                    params: {
                        'layers': 'geonode:dams500g',
                        'format': 'image/png'
                    }
                })
            }),
            'World Heritage Sites': new ol.layer.Tile({
                source: new ol.source.TileWMS({
                    url: 'http://lbimsgis.kartoza.com/geoserver/wms',
                    params: {
                        'layers': 'geonode:world_heritage_sites',
                        'format': 'image/png'
                    }
                })
            })
        },
        // source of layers
        administrativeBoundarySource: null,
        biodiversitySource: null,
        highlightVectorSource: null,
        layers: {},
        initialize: function () {
            this.layerStyle = new LayerStyle();
        },
        initLayer: function (layer, layerName, visibleInDefault) {
            this.layers[layerName] = {
                'layer': layer,
                'visibleInDefault': visibleInDefault
            };
            if (!visibleInDefault) {
                layer.setVisible(false);
            }
        },
        addLayersToMap: function (map) {
            var self = this;

            // RENDER NON BIODIVERSITY LAYERS
            $.each(self.nonBiodiversityLayersInitiation, function (key, value) {
                self.initLayer(value, key, false)
            });
            // ---------------------------------
            // ADMINISTRATIVE BOUNDARY LAYER
            // ---------------------------------
            self.administrativeBoundarySource = new ol.source.Vector({});
            self.initLayer(new ol.layer.Vector({
                source: self.administrativeBoundarySource,
                style: function (feature) {
                    return self.layerStyle.administrativeBoundaryStyle(feature);
                }
            }), 'Administrative', true);

            // ---------------------------------
            // BIODIVERSITY LAYERS
            // ---------------------------------
            self.biodiversitySource = new ol.source.Vector({});
            self.initLayer(new ol.layer.Vector({
                source: self.biodiversitySource,
                style: function (feature) {
                    return self.layerStyle.getBiodiversityStyle(feature);
                }
            }), 'Biodiversity', true);


            // RENDER LAYERS
            $.each(self.layers, function (key, value) {
                map.addLayer(value['layer']);
            });

            // ---------------------------------
            // HIGHLIGHT LAYER
            // ---------------------------------
            self.highlightVectorSource = new ol.source.Vector({});
            map.addLayer(new ol.layer.Vector({
                source: self.highlightVectorSource,
                style: function (feature) {
                    var geom = feature.getGeometry();
                    return self.layerStyle.getHighlightStyle(geom.getType());
                }
            }));
            this.renderLayers();
        },
        selectorChanged: function (layerName, selected) {
            this.layers[layerName]['layer'].setVisible(selected)
        },
        renderLayers: function () {
            var self = this;
            $(document).ready(function () {
                var mostTop = 'Biodiversity';
                var initKeys = [mostTop];
                var keys = Object.keys(self.layers);
                keys.splice($.inArray(mostTop, keys), 1);
                keys.sort();
                keys = initKeys.concat(keys);
                $.each(keys, function (index, key) {
                    var value = self.layers[key]
                    var selector = '<tr><td valign="top"><input type="checkbox" value="' + key + '" class="layer-selector-input" ';
                    if (value['visibleInDefault']) {
                        selector += 'checked';
                    }
                    selector += '></td><td valign="top">';
                    if (key === mostTop) {
                        selector += '<b>' + key + '</b>';
                    } else {
                        selector += key;
                    }
                    selector += '</td></tr>';
                    $('#layers-selector').append(selector);
                });
                $('.layer-selector-input').change(function (e) {
                    self.selectorChanged($(e.target).val(), $(e.target).is(':checked'))
                });
            });
        }
    })
});
