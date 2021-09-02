import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Login } from './Login'
import { Schemas } from './Schemas'
import { SchemaDetail } from './SchemaDetail'
import { NewSchema } from './NewSchema'
import { DataSet } from './DataSet'
import './app.css'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/schemas/new">
            <NewSchema />
          </Route>
          <Route path="/schemas/:id/dataset">
            <DataSet />
          </Route>
          <Route path="/schemas/:id">
            <SchemaDetail />
          </Route>
          <Route path="/">
            <Schemas />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
