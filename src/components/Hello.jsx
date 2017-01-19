import NoReact from 'no-react';

export class Hello extends NoReact.Component {
  onNameChange(event) {
    this.nameComponent.element.textContent = event.target.value;
  }

  render() {
    let value = 'World';

    this.nameComponent = <em className="hello__name">{value}</em>;

    return (
      <div className="hello">
        <h2>Hello {this.nameComponent}!</h2>

        <input type="text" oninput={this.onNameChange.bind(this)} value={value}/>
      </div>
    );
  }
}
