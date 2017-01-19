import NoReact from 'no-react';

export class Footer extends NoReact.Component {
  render() {
    let year = getCurrentYear();

    return (
      <footer className="footer">Copyright &copy; {year} NoReact. All rights reserved.</footer>
    );
  }
}

function getCurrentYear() {
  return (new Date()).getFullYear();
}
