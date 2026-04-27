import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

// Import Reducers
import userReducer from './user/reducer';
import jobsReducer from './jobs/reducer';
import applicationsReducer from './applications/reducer';

// Combine Reducers
const rootReducer = combineReducers({
  user: userReducer,
  jobs: jobsReducer,
  applications: applicationsReducer,
});

// Create Store with middleware
export const store = createStore(rootReducer, applyMiddleware(thunk));

// Export action creators for easy access
export * from './user/action';
export * from './jobs/action';
export * from './applications/action';
