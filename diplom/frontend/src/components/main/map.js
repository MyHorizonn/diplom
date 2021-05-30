import React, { Component, useState } from 'react';
import {connect} from 'react-redux';
import Map from 'ol/Map';
import View from 'ol/View';
import Tile from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature, Overlay } from 'ol';
import Point from 'ol/geom/Point';
import { fromLonLat} from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon'
import {getOrders} from '../../actions/orders'; 
import PropTypes from 'prop-types';


var points = []

var style = new Style({
  image: new Icon({
    scale: 0.7,
    src: 'https://raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png'
  }),
})

function createMap(orders){
  var i = 0;
  orders.map((order) => {
    points[i] = new Feature({
      geometry: new Point(fromLonLat([parseFloat(order.coordinate.lon), parseFloat(order.coordinate.lat)]))
    })
    points[i].setStyle(style)
    i += 1;
  })
  var layer = new VectorLayer({
    source: new VectorSource({
      features: points
    })
  })
  return layer
}


export class MyMap extends Component{
  static propTypes = {
    orders: PropTypes.array.isRequired,
    getOrders: PropTypes.func.isRequired,
  }

  constructor(props){
    super(props)

    this.olmap = new Map({
      target: null,
      layers: [
        new Tile({
          source: new OSM()
        })
      ],
      view: new View({
        center: [5348044, 5835836],
        zoom: 13,
      }),
    })
  }

  componentDidMount() {
    this.olmap.setTarget('map')
    this.props.getOrders()
  }

  render() {
    this.olmap.addLayer(createMap(this.props.orders))
    return(
      <div id="map" style={{ width: "100%", height: "700px" }}>
      </div>
    ) 
  }
}

const mapStateToProps = state => ({
  orders: state.orders.orders,
});

export default connect(mapStateToProps, {getOrders})(MyMap);


//    render ===> data ===> map on div