import React from 'react';

const Comment = ({ username, text }) => {
  return (
    <div className="comment">
      <strong>{username}</strong>: <p>{text}</p>
    </div>
  );
};

export default Comment;
