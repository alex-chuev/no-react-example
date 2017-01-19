# An example of a NoReact application

### JSX

If you are going to use JSX in your application please take into account the `.babelrc` file. There is important configuration of `transform-react-jsx` plugin:

    "pragma": "NoReact.createElement"

Than you can use JSX, for instance:

    export class App extends NoReact.Component {
      render() {
        return (
          <Container>
            <Header/>
            <Content/>
            <Footer/>
          </Container>
        );
      }
    }
