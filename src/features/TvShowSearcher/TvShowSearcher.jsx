import { useEffect, useState } from "react";

/* components */
import { TvShowBarChart } from "./TvShowBarChart/TvShowBarChart";
import { TvShowDetails } from "./TvShowDetails/TvShowDetails";
import { useData } from "./useData";

/* css */
import "./TvShowSearcher.css";
import { TvShowBubbleChart } from "./TvShowBubbleChart/TvShowBubbleChart";

const searchOptions = [
  { name: "Rank", value: "rank", order: "asc" },
  { name: "Num of Votes", value: "numVotes", order: "desc" },
];

export const TvShowSearcher = ({ width, height }) => {
  const data = useData();
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedOption, setSelectedOption] = useState(searchOptions[0]);
  const [allGenres, setAllGenres] = useState([]);
  const [genreArray, setGenreArray] = useState([]);
  const [moviesMappedByGenre, setMoviesMappedByGenre] = useState(new Map());
  const [selectedTVShow, setSelectedTVShow] = useState(null);

  if (!data) {
    return <div>Loading...</div>;
  }

  if (data && allGenres.length === 0) {
    let gMap = new Map();
    let mMappedByGenre = new Map();
    let gArr = [];
    data.forEach((d) => {
      d.genres.forEach((g) => {
        if (!gMap.get(g)) {
          gMap.set(g, 1);
        } else {
          gMap.set(g, gMap.get(g) + 1);
        }
        if (!mMappedByGenre.get(g)) {
          mMappedByGenre.set(g, []);
        }
        mMappedByGenre.get(g).push({
          ...d,
          rank: mMappedByGenre.get(g).length + 1,
        });
      });
    });
    let tmp = Array.from(gMap.keys()).sort();
    setAllGenres(tmp);
    gMap.keys().forEach((k) => {
      gArr.push({
        name: k,
        value: gMap.get(k),
      });
    });
    gArr.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    setGenreArray(gArr);
    setMoviesMappedByGenre(mMappedByGenre);
  }

  const getDataByFilters = (data, genre, option) => {
    if (data.length === 0) return [];

    let filteredData = [];
    if (genre) {
      filteredData = moviesMappedByGenre.get(genre);
    } else {
      filteredData = data;
    }

    if (option && option.order === "asc") {
      filteredData = filteredData.sort(
        (a, b) => a[option.value] - b[option.value]
      );
    } else if (option && option.order === "desc") {
      filteredData = filteredData.sort(
        (a, b) => b[option.value] - a[option.value]
      );
    }
    // console.log(`genre: ${genre}, option: ${JSON.stringify(option)}`);
    // console.log("Filtered Data ==> ", filteredData.slice(0, 10));

    return filteredData.slice(0, 10);
  };

  const handleTVShowClicked = (tv) => {
    // console.log("tv show clicked: ", tv);
    setSelectedTVShow(tv);
  };

  return (
    <div>
      <div className="charts">
        <TvShowBubbleChart width={width} height={height} data={genreArray} />
      </div>
      <div className="selections">
        <label>Genre:</label>
        <select onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value={""}>Select A Genre</option>
          {allGenres.map((g) => (
            <option value={g}>{g}</option>
          ))}
        </select>
        <label>Order By:</label>
        <select
          onChange={(e) => {
            setSelectedOption(
              searchOptions.filter((x) => x.value === e.target.value)[0]
            );
          }}
        >
          {searchOptions.map((g) => (
            <option value={g.value}>{g.name}</option>
          ))}
        </select>
      </div>
      <div className="charts">
        <TvShowBarChart
          width={width}
          height={height}
          data={getDataByFilters(data, selectedGenre, selectedOption)}
          selectedOption={selectedOption}
          onTVShowClicked={handleTVShowClicked}
        />
        <TvShowDetails show={selectedTVShow} />
      </div>
    </div>
  );
};
