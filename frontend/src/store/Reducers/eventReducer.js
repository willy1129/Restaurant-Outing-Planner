import { EVENT_ACTIONS_TYPES } from "../Actions/eventActions";

/**
 * Ideally, refer to eventsController.js for most recent update for data structure
 * name: ""
 * event: { event_id, event_name, event_description, host_name, host_id, duration }
 * participants: [{ name }, ...]
 * places: [{ proposer_name, address, restaurant_name, rating, place_id, total_votes, user_voted, position }]
 * schedules: [{ proposer_name, date, time, total_votes, user_voted }]
 */

export const INITIAL_STATE = {
  loading: false,
  error: false,
  name: "",
  event: {},
  participants: [],
  places: [],
  schedules: [],
  addedSchedules: [],
  addedPlaces: [],
};

export const eventReducer = (state, action) => {
  switch (action.type) {
    case EVENT_ACTIONS_TYPES.GET_START:
      return {
        ...state,
        loading: true,
      };
    case EVENT_ACTIONS_TYPES.GET_SUCCESS:
      return {
        ...state,
        loading: false,
        name: action.payload.name,
        event: action.payload.event,
        participants: action.payload.participants,
        places: action.payload.placeVoteInfo,
        schedules: action.payload.timeVoteInfo,
      };
    case EVENT_ACTIONS_TYPES.GET_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };

    case EVENT_ACTIONS_TYPES.ADD_SCHEDULE:
      const schedule = action.payload.newSchedule;
      schedule.proposer_name = state.name;
      schedule.total_votes = 1;
      schedule.user_voted = 1;

      return {
        ...state,
        schedules: [...state.schedules, schedule],
        addedSchedules: [...state.addedSchedules, schedule],
      };

    case EVENT_ACTIONS_TYPES.ADD_RESTAURANT:
      let restaurant = action.payload.newRestaurant; // { place_id, restaurant_name, vicinity (address), rating }
      restaurant.proposer_name = state.name;
      restaurant.total_votes = 1;
      restaurant.user_voted = 1;

      const newPlaces = [...state.places];
      const newAddedPlaces = [...state.addedPlaces];

      newPlaces.push(restaurant);
      newAddedPlaces.push(restaurant);

      return {
        ...state,
        places: newPlaces,
        addedPlaces: newAddedPlaces,
      };

    // params: placeToBeRemoved
    case EVENT_ACTIONS_TYPES.REMOVE_ADDED_RESTAURANT:
      let arr1 = [...state.places];
      let arr2 = [...state.addedPlaces];
      const target = action.payload.target;

      return {
        ...state,
        places: removeElemWithPlaceId(arr1, target),
        addedPlaces: removeElemWithPlaceId(arr2, target),
      };

    case EVENT_ACTIONS_TYPES.REMOVE_ADDED_SCHEDULE:
      let arr3 = [...state.schedules];
      let arr4 = [...state.addedSchedules];
      const targetTime = action.payload.targetTime;
      const targetDate = action.payload.targetDate;

      return {
        ...state,
        schedules: removeElemWithTime(arr3, targetTime, targetDate),
        addedSchedules: removeElemWithTime(arr4, targetTime, targetDate),
      };

    case EVENT_ACTIONS_TYPES.ADD_PARTICIPANT:
      let arr5 = [...state.participants];
      arr5.push(action.payload.participant);
      console.log("new participants: ", arr5);
      return {
        ...state,
        participants: arr5,
      };

    default:
      return state;
  }
};

const removeElemWithPlaceId = (arr = [], targetId) => {
  const index = arr.findIndex(({ place_id }) => place_id === targetId);
  if (index >= 0) arr.splice(index, 1);
  return arr;
};

const removeElemWithTime = (arr = [], targetTime, targetDate) => {
  const index = arr.findIndex(({ time, date }) => time === targetTime && date === targetDate);
  if (index >= 0) arr.splice(index, 1);
  return arr;
};
