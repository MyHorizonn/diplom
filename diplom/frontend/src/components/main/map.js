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
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon'
import {getOrders} from '../../actions/orders';
import {getMachines} from '../../actions/machines';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { getVectorContext } from 'ol/render';
import {Circle as CircleStyle, Fill, Stroke} from 'ol/style';


//  start_point
//  5351423.83571834
//  5836635.661390703

var style = new Style({
  image: new Icon({
    scale: 0.7,
    src: 'https://raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png'
  }),
})

var imageStyle = new Style({
  image: new CircleStyle({
    radius: 8,
    fill: new Fill({color: 'yellow'}),
    stroke: new Stroke({color: 'red', width: 1}),
  }),
});

var temp = 0;

var cars = []


export class MyMap extends Component{

  state = {
    filter: '',
    events: [],
    points: [],
  }

  static propTypes = {
    orders: PropTypes.array.isRequired,
    machines: PropTypes.array.isRequired,
    getOrders: PropTypes.func.isRequired,
    getMachines: PropTypes.func.isRequired,
  }

  emulateMoving(){
    console.log("sussy balls")
    cars.map((car) =>{
      if(Math.abs(car.current_point[0] - car.end_point[0]) >= car.step[0] && Math.abs(car.current_point[1] - car.end_point[1]) >= car.step[1])
      {
        car.current_point = [car.current_point[0] + car.step[0], car.current_point[1] + car.step[1]]
      }
      else{
        car.current_point = car.end_point
        // push event
      }
    })
  }

  spawnCars(orders, machines){
    orders.map((order) =>{
      machines.map((machine) =>{
        if(order.machines[0].machine == machine.id){
          var e_p = fromLonLat([parseFloat(order.coordinate.lon), parseFloat(order.coordinate.lat)])
          cars.push({
            current_point: [5351423.83571834, 5836635.661390703],
            end_point: [e_p[0], e_p[1]],
            step: [(e_p[0] - 5351423.83571834) / 10, (e_p[1] - 5836635.661390703) / 10]
          })
        }
      })
    })
  }

  createMap(orders){
    const { points } = this.state;
    var i = 0;
    orders.map((order) => {
      points[i] = new Feature({
        geometry: new Point(fromLonLat([parseFloat(order.coordinate.lon), parseFloat(order.coordinate.lat)])),
        name: [order.date_of_order, order.order_time, order.end_date_of_order, order.end_order_time, order.machines],
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

  constructor(props){
    super(props)

    this.tileLayer = new Tile({
      source: new OSM()
    })

    this.olmap = new Map({
      target: null,
      layers: [
        this.tileLayer
      ],
      view: new View({
        center: [5348044, 5835836],
        zoom: 13,
      }),
    })

    this.tileLayer.on('postrender', (evt) =>{
      var vectorContext = getVectorContext(evt)
      vectorContext.setStyle(imageStyle)
      cars.map((car) =>{
        vectorContext.drawGeometry(new Point(
          [car.current_point[0], car.current_point[1]]
        ))
      })
      this.olmap.render()
    })

    this.olmap.on('click', (evt) => {
      console.log(evt.coordinate)
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
        '<p>ID техники: ' + feature[0].get('name')[4][0].machine + '</p>' +
        '<p>Цена заказа: ' + feature[0].get('name')[4][0].cost + '</p>' +
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

  onSearch = (e) =>{
    e.preventDefault();
    var order_id = e.target.id
    var coordinate = {}
    this.props.orders.map((order) =>{
      if(order_id == order.id){
        coordinate = order.coordinate
      }
    })
    this.olmap.setView(new View({
      center: fromLonLat([coordinate.lon, coordinate.lat], 'EPSG:3857'),
      zoom: 17
    }))
}

  moving = 0

  check(){
    
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })};

  componentDidMount() {
    this.olmap.setTarget('map')
    this.props.getOrders()
    this.props.getMachines()
    this.moving = setInterval(this.emulateMoving, 1000)
  }

  componentWillUnmount(){
    clearInterval(this.moving)
  }


  render() {
    const {filter, events} = this.state;
    this.olmap.addLayer(this.createMap(this.props.orders))
    this.spawnCars(this.props.orders, this.props.machines)
    return(
      <Fragment>
        <div className="card card-body mt-4 mb-4">
          <div id="map" style={{ width: "100%", height: "700px"}}>
            <div className="card card-body mt-4 mb-4" id="popup" style={{position: 'absolute', backgroundColor: 'white', border: '1px solid black'}}></div>
          </div>
        </div>
        <div>
        <h2>События</h2>
        <button type="button" className="btn btn-primary" onClick={this.check}>OK</button>
        <div className="card card-body mt-4 mb-4">
          <ul style={{overflowX: 'scroll', display: 'flex'}}>

            <li style={{display:'inline-block', marginRight: '10px'}}>
              <div className="card text-white bg-success mb-3">
                <div className="card-header">Head</div>
                <div className="card-body">
                  <h4>Head of body</h4>
                  <p>Body</p>
                </div>
                <button type="button" className="btn btn-primary">Ок</button>
              </div>
            </li>

          </ul>
        </div>
        <h2>Список заказов</h2>
                <div className='form-group'>
                    <h5>Поиск</h5>
                    <input
                        className="form-control"
                        type="text"
                        name="filter"
                        onChange={this.onChange}
                        value={filter}
                    />
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Дата заказа</th>
                            <th>Время заказа</th>
                            <th>Стоимость ₽</th>
                            <th>Номер телефона</th>
                            <th>ФИО клиента</th>
                            <th>Адрес</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.orders.filter((el) => {
                            const  new_filter = filter.toLowerCase()
                            return filter ? el.client_fio.toLowerCase().includes(new_filter) || el.address.toLowerCase().includes(new_filter) : true
                        }
                        ).map((order) =>(
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td width='25%'>{order.date_of_order}</td>
                                <td>{order.order_time}</td>
                                <td>{order.cost}</td>
                                <td>{order.client_num}</td>
                                <td>{order.client_fio}</td>
                                <td width='50%'>{order.address}</td>
                                <td><button
                                id={order.id}
                                onClick={this.onSearch}
                                className="btn btn-info btn-sm">
                                    Найти</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  orders: state.orders.orders,
  machines: state.machines.machines,
});

export default connect(mapStateToProps, {getOrders, getMachines})(MyMap);