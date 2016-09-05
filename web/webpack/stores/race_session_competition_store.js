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
import alt from '../alt';

var RaceSessionActions = require('../actions/race_session_action.js');

class RaceSessionCompetitionStore {
  constructor() {
    this.bindAction(RaceSessionActions.createCompetition, this.onCreatedCompetition);

    this.data = [];
  }

  onCreatedCompetition(data) {
  }

}

export default alt.createStore(RaceSessionCompetitionStore, 'RaceSessionCompetitionStore');
