import NoReact from 'no-react';

import { Header } from './Header';
import { Content } from './Content';
import { Footer } from './Footer';
import { Hello } from './Hello';

export class App extends NoReact.Component {
  render() {
    return (
      <div className="app">
        <Header title="Hello App"/>

        <Content>
          <Hello/>
        </Content>

        <Footer/>
      </div>
    );
  }
}
