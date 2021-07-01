import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home/index'; 
import { NewRoom } from './pages/NewRoom/index';
import { AuthContextProvider } from './contexts/AuthContext';
import { Room } from './pages/Room/index';
import { AdminRoom } from './pages/AdminRoom/index';
import { RoomList } from './pages/RoomList/index';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" exact component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
          <Route path="/admin/rooms/:id" component={AdminRoom} />
          <Route path="/RoomList" component={RoomList} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
