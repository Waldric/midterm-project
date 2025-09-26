import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, err };
  }
  componentDidCatch(err, info) {
    console.error("ErrorBoundary caught:", err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-3xl mx-auto p-6">
          <div className="alert alert-error">
            <span>Something went wrong.</span>
          </div>
          <pre className="mt-4 text-xs whitespace-pre-wrap">
            {String(this.state.err)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
