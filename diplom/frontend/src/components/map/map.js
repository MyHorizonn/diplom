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
import {getFreeMachines} from '../../actions/machines';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { getVectorContext } from 'ol/render';
import {Circle as CircleStyle, Fill, Stroke} from 'ol/style';
import { createTiming, getTiming } from '../../actions/timingtables';

//  start_point for emulator
//  5351423.83571834 - lon
//  5836635.661390703 - lat

var style = new Style({
  image: new Icon({
    scale: 0.7,
    src: 'https://raw.githubusercontent.com/jonataswalker/map-utils/master/images/marker.png'
  }),
})

var imageStyle = new Style({
  image: new CircleStyle({
    radius: 7,
    fill: new Fill({color: 'yellow'}),
    stroke: new Stroke({color: 'red', width: 1}),
  }),
});

var cars = []
var ev_i = 0

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = jQuery.trim(cookies[i]);
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}


export class MyMap extends Component{

  state = {
    filter: '',
    events: [],
    points: [],
  }

  static propTypes = {
    orders: PropTypes.array.isRequired,
    machines: PropTypes.array.isRequired,
    timingtables: PropTypes.array.isRequired,
    getOrders: PropTypes.func.isRequired,
    getFreeMachines: PropTypes.func.isRequired,
    createTiming: PropTypes.func.isRequired,
    getTiming: PropTypes.func.isRequired,
  }

  moving = 0

  constructor(props){
    super(props)

    this.eventCreator = this.eventCreator.bind(this);
    this.emulateMoving = this.emulateMoving.bind(this);
    this.start = this.start.bind(this);

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
        '<p>ID техники: ' + feature[0].get('name')[4] + '</p>' +
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

  spawnCars(orders, machines){
    cars = []
    orders.map((order) =>{
      machines.map((machine) =>{
        if(order.timing_machines.length != 0)
        {
          if(order.timing_machines[0].machine == machine.id){
            var e_p = fromLonLat([parseFloat(order.coordinate.lon), parseFloat(order.coordinate.lat)])
            cars.push({
              id: machine.id,
              name: machine.name,
              current_point: [5351423.83571834, 5836635.661390703],
              end_point: [e_p[0], e_p[1]],
              step: [(e_p[0] - 5351423.83571834) / 10, (e_p[1] - 5836635.661390703) / 10],
              adress: order.address,
          })
        }
      }
      })
    })
  }

  createMap(orders, timing){
    const { points } = this.state;
    var i = 0;
    var machine = ''
    orders.map((order) => {
      timing.map((timing) =>{
        if(order.id == timing.order){
          machine = timing.machine
        }
      })
          points[i] = new Feature({
            geometry: new Point(fromLonLat([parseFloat(order.coordinate.lon), parseFloat(order.coordinate.lat)])),
            name: [order.date_of_order, order.order_time, order.end_date_of_order, order.end_order_time, machine == '' ? 'Техника не назначена' : machine],
          })
          points[i].setStyle(style)
          i += 1;
          machine = ''
    })
    var layer = new VectorLayer({
      source: new VectorSource({
        features: points
      })
    })
    return layer
  }

  eventCreator(car, eventType){
    var temp = this.state.events
    if(eventType == "started"){
      temp.push(Object.assign({}, car, {eventType: "Начал движение", id_i: ev_i}))
      ev_i++;
      this.setState({
        events: temp
      })
    }
    if(eventType == "reached"){
      temp.push(Object.assign({}, car, {eventType: "Прибыл", id_i: ev_i}))
      ev_i++;
      this.setState({
        events: temp
      })
    }
  }

  emulateMoving(){
    cars.map((car) =>{
      if(car.current_point[0] != car.end_point[0] && car.current_point[1] != car.end_point[1]){
        if(Math.abs(car.current_point[0] - car.end_point[0]) >= Math.abs(car.step[0]) && Math.abs(car.current_point[1] - car.end_point[1]) >= Math.abs(car.step[1]))
        {
          car.current_point = [car.current_point[0] + car.step[0], car.current_point[1] + car.step[1]]
          if(Math.abs(car.current_point[0] - car.end_point[0]) < Math.abs(car.step[0]) && Math.abs(car.current_point[1] - car.end_point[1]) < Math.abs(car.step[1])){
            car.current_point = car.end_point
            this.eventCreator(car, "reached")
          }
        }
        else{
          car.current_point = car.end_point
          this.eventCreator(car, "reached")
        }
      }
    })
  }

  start(){
    clearInterval(this.moving)
    this.spawnCars(this.props.orders, this.props.machines)
    cars.map((car) => {
      this.eventCreator(car, "started");
    })
    this.moving = setInterval(this.emulateMoving, 1000)
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

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })};

  onSubmit = (e) =>{
    e.preventDefault()
    var order = document.getElementById('order-0').value;
    var machine = document.getElementById('machine-0').value;
    this.props.createTiming(getCookie('csrftoken'), order, machine)
    alert('Техника успешно назначена')
  }

  changeSelect = (e) =>{
    e.preventDefault()
    document.getElementById('machine-0').innerText = null
    var m_s = document.getElementById('machine-0');
    var default_opt = document.createElement('option')
    default_opt.value = ""
    default_opt.selected = true
    default_opt.disabled = true
    default_opt.hidden = true
    default_opt.innerHTML = '--------------------'
    m_s.appendChild(default_opt)
    var order_id = document.getElementById("order-0").value;
    var type = 0
    this.props.orders.map((order) =>{
      if(order.id == order_id){type = order.machine_type}
    })
    this.props.machines.map((machine) =>{
      if(machine.type == type){
        var opt = document.createElement('option')
        opt.value = machine.id
        opt.innerHTML = machine.name
        m_s.appendChild(opt)
      }
    })
  }

  delEvent = (e) =>{
    var temp = this.state.events;
    temp.splice(e, 1)
    this.setState({
      events: temp
    })
  }

  componentDidMount() {
    this.olmap.setTarget('map')
    this.props.getOrders(getCookie('csrftoken'))
    this.props.getFreeMachines(getCookie('csrftoken'))
    this.props.getTiming(getCookie('csrftoken'))
  }

  componentWillUnmount(){
    clearInterval(this.moving)
    cars = []
  }

  render() {
    const { filter, events } = this.state;
    if(cars.length == 0){
      this.olmap.addLayer(this.createMap(this.props.orders, this.props.timingtables))
    }
    return(
      <Fragment>
        <div className="card card-body mt-4 mb-4">
          <div id="map" style={{ width: "100%", height: "700px"}}>
            <div className="card card-body mt-4 mb-4" id="popup" style={{position: 'absolute', backgroundColor: 'white', border: '1px solid black'}}></div>
          </div>
        </div>
        <div>
        <button type="button" className="btn btn-primary" onClick={this.start}>Go</button>
        <h2>События</h2>
        <div className="card card-body mt-4 mb-4">
          <ul style={{overflowX: 'scroll', display: 'flex'}}>
            { events.map((event) =>(
              <li style={{display:'inline-block', marginRight: '10px'}} key={event.id_i}>
              <div className="card border-success mb-3" style={{ width: '400px', height: '250px'}}>
                <div className="card-header">Событие</div>
                <div className="card-body">
                  <h5>Событие: {event.eventType}</h5>
                  <h5>Техника: {event.name}</h5>
                  <h5>ID Техники: {event.id}</h5>
                  <h5>Адрес: {event.adress}</h5>
                </div>
                <button type="button" className="btn btn-primary" onClick={this.delEvent.bind(this, events.indexOf(event))}>Ок</button>
              </div>
            </li>
            ))}
          </ul>
        </div>
        <h2>Распределение</h2>
        <div className="card card-body mt-4 mb-4">
          <form onSubmit={this.onSubmit}>
              <div className='form-group'>
              <table style={{ borderSpacing: '30px 7px', borderCollapse: 'separate'}}>
                        <thead>
                            <tr>
                                <th>Заказ</th>
                                <th>Техника</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="block-0">
                                <td className="field-order">
                                    <select className='form-control' id="order-0" onChange={this.changeSelect}>
                                        <option value="" selected disabled hidden>----------------</option>
                                        {this.props.orders.map((order) =>(
                                            !order.timing_machines.length &&
                                            <option key={order.id} value={order.id}>{order.address}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                  <select className='form-control' id='machine-0'>
                                    <option value="" selected disabled hidden>------------------</option>
                                  </select>
                                </td>
                                <td>
                                  <div className="form-group">
                                    <button type="submit" className="btn btn-primary">
                                      Назначить
                                    </button>
                                  </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
              </div>
              
          </form>
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
                <table className="table" style={{width: '1400px', maxHeight:'500px', overflowY: 'scroll', overflowX:'hidden', display: 'inline-block'}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Дата заказа</th>
                            <th>Время заказа</th>
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
                                <td width='10%'>{order.date_of_order}</td>
                                <td>{order.order_time}</td>
                                <td width='10%'>{order.end_date_of_order}</td>
                                <td>{order.end_order_time}</td>
                                <td>{order.cost}</td>
                                <td>{order.client_num}</td>
                                <td>{order.client_fio}</td>
                                <td>{order.address}</td>
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
  timingtables: state.timingtables.timingtables,
});

export default connect(mapStateToProps, {getOrders, getFreeMachines, createTiming, getTiming})(MyMap);