const EmptyState = ({
title = "Nothing here yet",
description = "Content will appear here when available.",
action
}) => (

  <section className="empty-state">
    <div className="empty-state-icon" aria-hidden="true">✦</div>
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </section>
);

export default EmptyState;
