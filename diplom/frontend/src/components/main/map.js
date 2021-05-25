import React, { Component, useState } from 'react';
import {connect} from 'react-redux';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { fromLonLat, transform } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon'
import {getOrders} from '../../actions/orders';
import {getMachines} from '../../actions/machines';
import PropTypes from 'prop-types';


var style = new Style({
  image: new Icon({
    scale: 0.1,
    src: 'https://img-premium.flaticon.com/png/512/787/787535.png?token=exp=1621958396~hmac=5a79f9335b37b82e2bb9505ffa3ff46c',
  }),
})


export class MyMap extends Component{

  static propTypes = {
    machines: PropTypes.array.isRequired,
    getMachines: PropTypes.func.isRequired,
    getOrders: PropTypes.func.isRequired,
  }
  
  constructor(props) {
    super(props);

    this.state = { 
      center: [5348044, 5835836], 
      zoom: 13 
    };

    this.olmap = new Map({
      target: null,
      layers: [
        new Tile({
          source: new OSM()
        })
      ],
      view: new View({
        center: this.state.center,
        zoom: this.state.zoom
      })
    });

    this.olmap.on('singleclick', (evt) =>
    {
      var feature = new Feature({
        geometry: new Point(fromLonLat(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')))
      })
      feature.setStyle(style)
      var layer = new VectorLayer({
        source: new VectorSource({
          features: [feature]
        })
      })
      console.log(layer)
      this.olmap.addLayer(layer)
      console.log(evt.coordinate)
    })
  }

  componentDidMount() {
    this.olmap.setTarget("map");
    this.props.getMachines()
    this.props.getOrders()
  }

  render() {
    return (
      <div id="map" style={{ width: "100%", height: "700px" }}>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  machines: state.machines.machines,
  orders: state.orders.orders,
});

export default connect(mapStateToProps, {getMachines, getOrders})(MyMap);