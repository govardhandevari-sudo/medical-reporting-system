
import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🧯 UI Error Caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="Something went wrong"
          subTitle={this.state.error?.message || 'An unexpected error occurred.'}
          extra={<Button onClick={this.handleReload}>Reload Page</Button>}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
