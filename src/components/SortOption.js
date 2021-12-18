import React from "react";

const SortOption = ({ changeSort, sortMethod, currentSort, reverse }) => {
  return (
    <>
      <li
        onClick={() => {
          changeSort("title");
          changeSort(sortMethod, reverse);
        }}
        style={{ fontWeight: "bold", cursor: "pointer" }}
        className={
          "list-group-item rounded m-1 " +
          (currentSort === sortMethod ? "bg-primary" : "")
        }
      >
        {sortMethod.charAt(0).toUpperCase() + sortMethod.slice(1)}
      </li>
    </>
  );
};

SortOption.defaultProps = {
  reverse: false,
};

export default SortOption;
