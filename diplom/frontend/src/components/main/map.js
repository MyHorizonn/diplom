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
import PropTypes from 'prop-types';
import { create } from 'ol/transform';


var points = []


var style = new Style({
  image: new Icon({
    scale: 1,
    src: 'https://openlayers.org/en/latest/examples/data/dot.svg'
  }),
})


function createMap(orders){
  var i = 0;
  orders.map((order) => {
    console.log("coords",[order.coordinate.lat, order.coordinate.lon])
    points[i] = new Feature({
      geometry: new Point(fromLonLat(transform([order.coordinate.lat, order.coordinate.lon], 'EPSG:3857', 'EPSG:4326')))
    })
    points[i].setStyle(style)
    console.log('point', points[i])
    i += 1;
  })
  
  var layer = new VectorLayer({
    source: new VectorSource({
      features: points
    })
  })

  var olmap = new Map({
    target: null,
    layers: [
      new Tile({
        source: new OSM()
      }),
      layer,
    ],
    view: new View({
      center: [5348044, 5835836],
      zoom: 13
    })
  })

  return olmap
}


export class MyMap extends Component{
  static propTypes = {
    orders: PropTypes.array.isRequired,
    getOrders: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.getOrders()
    console.log("orders_cdm:",this.props.orders)
  }

  render() {
    var map = createMap(this.props.orders)
    console.log("orders_render:",this.props.orders)
    return(
      <div id="map" style={{ width: "100%", height: "700px" }}>
        {map.setTarget('map')}
      </div>
    ) 
  }
}

const mapStateToProps = state => ({
  orders: state.orders.orders,
});

export default connect(mapStateToProps, {getOrders})(MyMap);


//    render ===> data ===> map on div