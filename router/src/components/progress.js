import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const ProgressBarComponent = ({ progress, stepLabel }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <ProgressBar
        now={progress}
        label={stepLabel}
        variant={progress < 26 ? 'primary' : progress < 51 ? 'secondary' : 'success'}
      />
    </div>
  );
};

export default ProgressBarComponent;
