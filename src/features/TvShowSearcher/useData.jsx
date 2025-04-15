import { useState, useEffect } from "react";
import { csv } from "d3";

const url =
  "https://gist.githubusercontent.com/paing95/4348fae6de77009522df8a2a20600f98" +
  "/raw/91c220eacb02832fd7c6a6eb435839c6c8f6a4cb/imdb_top_5000_tv_shows.csv";

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const updateRow = (row) => {
      row.startYear = +row.startYear;
      row.endYear = +row.endYear;
      row.rank = +row.rank;
      row.averageRating = +row.averageRating;
      row.numVotes = +row.numVotes;
      row.directors = row.directors.split(", ");
      row.genres = row.genres.split(", ");
      row.writers = row.writers.split(", ");
      return row;
    };
    csv(url, updateRow).then(setData);
  }, []);

  return data;
};
