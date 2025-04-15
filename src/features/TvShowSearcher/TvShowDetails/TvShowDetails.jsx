import "./TvShowDetails.css";

export const TvShowDetails = ({ show }) => {
  if (!show) return <></>;

  return (
    <div className="tvshow-details">
      <h3 className="title">
        {show.primaryTitle} ({show.startYear} -{" "}
        {show.endYear ? show.endYear : "Present"})
      </h3>
      <div className="row">
        <div className="col-md-2">Genres:</div>
        <div className="col-md-10 info">
          {show.genres.map((g) => (
            <span class="badge rounded-pill text-bg-secondary">{g}</span>
          ))}
        </div>
      </div>
      <div className="row">
        <div className="col-md-2">Directors:</div>
        <div className="col-md-10 info">{show.directors.join(", ")}</div>
      </div>
      <div className="row">
        <div className="col-md-2">Writers:</div>
        <div className="col-md-10 info">{show.writers.join(", ")}</div>
      </div>
    </div>
  );
};
