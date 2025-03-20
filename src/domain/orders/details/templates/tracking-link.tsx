export const TrackingLink = ({ trackingLink }) => {
  if (trackingLink.url) {
    return (
      <a
        style={{ textDecoration: "none" }}
        target="_blank"
        href={trackingLink.url}
        rel="noreferrer"
      >
        <div className="ml-2 text-blue-60">{trackingLink.tracking_number} </div>
      </a>
    )
  } else {
    return (
      <span className="ml-2 text-blue-60">{trackingLink.tracking_number} </span>
    )
  }
}
