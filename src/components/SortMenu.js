import React from "react";
import SortOption from "./SortOption";

const SortMenu = ({ currentSort, changeSort }) => {
  return (
    <>
      <ul className="list-group-horizontal row">
        <SortOption
          changeSort={changeSort}
          sortMethod={"title"}
          currentSort={currentSort}
        />
        <SortOption
          changeSort={changeSort}
          sortMethod={"artist"}
          currentSort={currentSort}
        />
        <SortOption
          changeSort={changeSort}
          sortMethod={"release"}
          currentSort={currentSort}
        />
        <SortOption
          changeSort={changeSort}
          sortMethod={"rating"}
          currentSort={currentSort}
          reverse={true}
        />
      </ul>
    </>
  );
};

export default SortMenu;
