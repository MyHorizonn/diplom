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
  console.log("orders:", orders)
  var i = 0;
  orders.map((order) => {
    console.log("coords:",[parseFloat(order.coordinate.lat), parseFloat(order.coordinate.lon)])
    points[i] = new Feature({
      geometry: new Point(fromLonLat([parseFloat(order.coordinate.lon), parseFloat(order.coordinate.lat)]))
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
      })
    })

    this.olmap.on('singleclick', (evt) =>{
      var feature = new Feature({
        geometry: new Point(fromLonLat(transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326')))
      })
      feature.setStyle(style)
      var layer = new VectorLayer({
        source: new VectorSource({
          features: [feature]
        })
      })
      this.olmap.addLayer(layer)
      this.olmap.addLayer(createMap(this.props.orders))
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