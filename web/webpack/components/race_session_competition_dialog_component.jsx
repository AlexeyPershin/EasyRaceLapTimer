/**
 * EasyRaceLapTimer - Copyright 2015-2016 by airbirds.de, a project of polyvision UG (haftungsbeschränkt)
 *
 * Author: Alexander B. Bierbrauer
 *
 * This file is part of EasyRaceLapTimer.
 *
 * OpenRaceLapTimer is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenRaceLapTimer is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with Foobar. If not, see http://www.gnu.org/licenses/.
 **/
'use strict';

var PilotsStore = require('../stores/pilots_store.js');
var RaceSessionCompetitionStore = require('../stores/race_session_competition_store.js');

var PilotsActions = require('../actions/pilot_action.js');
var RaceSessionActions = require('../actions/race_session_action.js');

var RaceSessionCompetitionDialogEntryComponent = require('../components/race_session_competition_dialog_entry_component.jsx');


var RaceSessionCompetitionDialogComponent = React.createClass({
  getInitialState: function(){
      return {pilots_data: [],pilots_listing: [], max_laps: 4, title: "Competition",num_satellites: 0, time_penalty_per_satellite: 2500,hot_seat_enabled: false,idle_time_in_seconds:0 };
  },

  componentDidMount: function(){
    PilotsStore.listen(this._handleStoreUpdate);
    RaceSessionCompetitionStore.listen(this._handleRaceSessionStoreUpdate);

    PilotsActions.list(); // fetch the pilots list
  },

  _handleStoreUpdate: function(){
    this.setState({pilots_data: PilotsStore.getState().data});
  },

  _handleRaceSessionStoreUpdate: function(){
    // this is not the REACT way ... but well... it works for now
    window.location = "/monitor";
  },

  _addPilot: function(){
    var v = $("#pilot_comp_selection").val();

    var t_pilots_listing = this.state.pilots_listing;

    for(var i = 0; i < this.state.pilots_data.length; i++){
      if(this.state.pilots_data[i].id == parseInt(v,10)){
        t_pilots_listing.push(this.state.pilots_data[i]);
        this.setState({pilots_listing: t_pilots_listing});
      }
    }
  },

  _removePilot: function(id){
    var t_pilots_listing = this.state.pilots_listing;
    var new_pilots_listing = [];
    for(var i = 0; i < t_pilots_listing.length; i++){
      if(t_pilots_listing[i].id != parseInt(id,10)){
        new_pilots_listing.push(t_pilots_listing[i]);

      }
    }
    this.setState({pilots_listing: new_pilots_listing});
  },

  _changePilotToken: function(id,token){
    var t_pilots_listing = this.state.pilots_listing;

    for(var i = 0; i < t_pilots_listing.length; i++){
      if(t_pilots_listing[i].id == parseInt(id,10)){
        t_pilots_listing[i].transponder_token = token;
      }
    }
    this.setState({pilots_listing: t_pilots_listing});
  },

  _changeMaxLaps: function(e){
    this.setState({max_laps: e.target.value});
  },

  _changeIdleTimeInSeconds: function(e){
    this.setState({idle_time_in_seconds: e.target.value});
  },

  _changeTitle: function(e){
    this.setState({title: e.target.value});
  },

  _changeTimePenaltyPerSatellite: function(e){
    this.setState({time_penalty_per_satellite: e.target.value});
  },

  _changeNumSatellites: function(e){
    this.setState({num_satellites: e.target.value});
  },

  _changeHotSeatEnabled: function(e){
    this.setState({hot_seat_enabled: e.target.checked});
  },

  _createCompetition: function(e){
    e.preventDefault();

    if(this._pilotValidateUniqueTokens() == false){
      alert("transponder tokens must be unique, please change them!");
    }else{
        RaceSessionActions.createCompetition(this.state.title,this.state.max_laps,this.state.num_satellites,this.state.time_penalty_per_satellite,this.state.pilots_listing,this.state.hot_seat_enabled,this.state.idle_time_in_seconds);
    }

  },

  _pilotAlreadySelected: function(id){
    for(var i = 0; i < this.state.pilots_listing.length; i++){
      if(this.state.pilots_listing[i].id == parseInt(id,10)){
        return true;
      }
    }
    return false;
  },

  _pilotValidateUniqueTokens: function(){
    var check = true;

    var used_tokens = [];
    for(var i = 0; i < this.state.pilots_listing.length; i++){

      for(var t = 0; t < used_tokens.length; t++){
        if(used_tokens[t] == this.state.pilots_listing[i].transponder_token){
          check = false;
        }
      }
      used_tokens.push(this.state.pilots_listing[i].transponder_token);
    }

    return check;
  },

  render: function(){
    var select_content = this.state.pilots_data.map(function(entry){
      if(this._pilotAlreadySelected(entry.id) == false){
          return (<option value={entry.id}>{entry.name} - {entry.quad}</option>)
      }
    }.bind(this));

    var table_content = this.state.pilots_listing.map(function(entry){
      return (<RaceSessionCompetitionDialogEntryComponent pName={entry.name} pQuad={entry.quad} pTransponderToken={entry.transponder_token} pId={entry.id} onChangeToken={this._changePilotToken} onRemove={this._removePilot}></RaceSessionCompetitionDialogEntryComponent>)
    }.bind(this));

    return (
      <div>
        <div className="row">
          <div className="col-xs-8">
            <div className="form-group">
              <label>Pilots:</label>
              <select id="pilot_comp_selection" className="form-control">{select_content}</select>
            </div>
          </div>
          <div className="col-xs-4">
            <button onClick={this._addPilot} className="btn">Add</button>
          </div>
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input className="form-control" type="text" onChange={this._changeTitle} defaultValue="Competition" value={this.state.title} required={true}></input>
        </div>
        <div className="form-group">
          <label>Max laps:</label>
          <input className="form-control" type="text" onChange={this._changeMaxLaps} value={this.state.max_laps} required={true}></input>
        </div>
        <div className="form-group">
          <label>Num Satellites:</label>
          <input className="form-control" type="text" onChange={this._changeNumSatellites} value={this.state.num_satellites} required={true}></input>
        </div>
        <div className="form-group">
          <label>Time Penalty per Satellite microseconds:</label>
          <input className="form-control" type="text" onChange={this._changeTimePenaltyPerSatellite} value={this.state.time_penalty_per_satellite} required={true}></input>
        </div>
        <div className="form-group">
          <label>Hot seat enabled:</label>
          <span className="glyphicon glyphicon-question-sign" aria-hidden="true" data-toggle="tooltip" data-placement="right" title="Everyone can attend this race. You don't need to explicitly set the pilots attending to this race."></span>
          <input className="form-control" type="checkbox" onClick={this._changeHotSeatEnabled} checked={this.state.hot_seat_enabled} required={true}></input>
        </div>
        <div className="form-group">
          <label>Idle time:</label>
          <span className="glyphicon glyphicon-question-sign" aria-hidden="true" data-toggle="tooltip" data-placement="right" title="After X seconds of no tracked lap, the race will finish automaticly. As soon as a new lap gets tracked, the system will autostart a new race. Enter 0 will ignore this option."></span>
          <input className="form-control" type="text" onChange={this._changeIdleTimeInSeconds} value={this.state.idle_time_in_seconds} required={true}></input>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Pilot</th>
              <th>Transponder</th>
              <th>Quad</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {table_content}
          </tbody>
        </table>
        <button className="btn btn-primary btn-warning" onClick={this._createCompetition} >start competition</button>
      </div>);
  }
});

module.exports = RaceSessionCompetitionDialogComponent;
