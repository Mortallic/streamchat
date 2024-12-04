import './ModComment.css';

function ModComment({ comment }) {
  if (!comment) return null;

  return (
    <div className="mod-comment">
      <div className="mod-comment-label">Mod Note:</div>
      <div className="mod-comment-content">{comment}</div>
    </div>
  );
}

export default ModComment; 