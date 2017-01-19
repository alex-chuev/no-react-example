import NoReact from 'no-react';

export class Header extends NoReact.Component {
  render() {
    return (
      <h1 className="header">{this.properties.title}</h1>
    );
  }
}
