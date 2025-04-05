import React from 'react';

const Comment = ({ username, comment}) => {
  return (
    <div className="comment">
      <strong>{username}</strong>: <p>{comment}</p>
    </div>
  );
};

export default Comment;
