import React, { Component } from 'react';
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
      geometry: new Point(fromLonLat([parseFloat(order.coordinate.lon), parseFloat(order.coordinate.lat)])),
      name: [order.date_of_order, order.order_time, order.end_date_of_order, order.end_order_time],
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

    this.olmap.on('click', (evt) => {
      var tik = this.olmap.getEventPixel(evt.originalEvent)
      var overlay = new Overlay({
        element: document.getElementById('popup'),
        positioning: 'center-center',
        autoPan: true,
        stopEvent: false,
      })
      this.olmap.addOverlay(overlay)
      var feature = this.olmap.getFeaturesAtPixel(tik)
      if (feature[0]) {
        document.getElementById('popup').innerHTML =
        '<table width="525px">' +
        '<thead>' +
            '<tr>' +
                '<th>Дата заказа</th>' +
                '<th>Время заказа</th>' +
                '<th>Дата окончания</th>' +
                '<th>Время окончания</th>' +
            '</tr>' +
        '</thead>' +
        '<tbody>' +
         '<tr>' +
           '<td align="center">' + feature[0].get('name')[0] + '</td>' +
           '<td align="center">' + feature[0].get('name')[1] + '</td>' +
           '<td align="center">' + feature[0].get('name')[2] + '</td>' +
           '<td align="center">' + feature[0].get('name')[3] + '</td>' +
          '</tr>' +
           '</tbody>' +
        '</table>'
        overlay.setPosition(evt.coordinate);
      }
      else{
        overlay.setPosition(undefined)
      }
    })

    this.olmap.on('pointermove', (evt) =>{
      var feature = this.olmap.getFeaturesAtPixel(this.olmap.getEventPixel(evt.originalEvent))
      if(feature[0]){
        this.olmap.getTargetElement().style.cursor = 'pointer'
      }
      else{
        this.olmap.getTargetElement().style.cursor = ''
      }
    })
  }

  componentDidMount() {
    this.olmap.setTarget('map')
    this.props.getOrders()
  }

  render() {
    this.olmap.addLayer(createMap(this.props.orders))
    return(
      <div id="map" style={{ width: "100%", height: "700px"}}>
        <div className="card card-body mt-4 mb-4" id="popup" style={{position: 'absolute', backgroundColor: 'white', border: '1px solid black'}}></div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  orders: state.orders.orders,
});

export default connect(mapStateToProps, {getOrders})(MyMap);


//    render ===> data ===> map on div