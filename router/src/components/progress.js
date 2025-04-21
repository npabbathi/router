import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const ProgressBarComponent = ({ progress, stepLabel }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <ProgressBar
        now={progress}
        label={stepLabel}
        variant={progress < 34 ? 'primary' : progress < 67 ? 'secondary' : 'success'}
      />
    </div>
  );
};

export default ProgressBarComponent;
