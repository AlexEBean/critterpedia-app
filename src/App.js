import './App.css';
import Header from './components/Header/Header'
import routes from './routes'

function App() {
  return (
    <div className="App">
      <meta name="image" property="og:image" content="[Image URL here]"></meta>
      <Header/>
      {routes}
    </div>
  );
}

export default App;
