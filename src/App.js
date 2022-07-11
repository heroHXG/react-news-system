
import './App.css';

import IndexRouter from './router/IndexRouter'
import './App.css'
import {Provider} from 'react-redux'
import {store, persistor} from '@/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
 
function App() {
 
  
  return (
    <div className="App">
      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
              <IndexRouter></IndexRouter>
          </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
