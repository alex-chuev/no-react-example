import NoReact from 'no-react';

export class Content extends NoReact.Component {
  render(content) {
    return (
      <article className="content">{content}</article>
    );
  }
}
