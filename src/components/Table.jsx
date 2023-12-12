import React, { useEffect, useRef, useId, useState, useMemo } from "react";
import cx from "classnames";
import s from "./table.module.scss";
import { TableOptions } from "./TableOptions";

export const Table = ({ columns, data }) => {
  const tableWrapperRef = useRef(null);
  const tableRef = useRef(null);
  const checkBoxId = useId();
  const [pinnedColumns, setPinnedColumns] = useState(
    columns.reduce((total, curr) => {
      total[curr.key] = false;
      return total;
    }, {})
  );

  useEffect(() => {
    // Get all the sticky columns
    const stickyColumns = tableRef.current.querySelectorAll(
      `.${s["is-sticky"]}, .${s["is-pinned"]}`
    );
    // Calculate the left offset for each sticky column
    stickyColumns.forEach((column) => {
      const row = column.closest("tr");
      const stickyCells = row.querySelectorAll(
        `.${s["is-sticky"]}, .${s["is-pinned"]}`
      );
      let leftOffset = 0;

      // Calculate the left offset for each sticky cell in the row
      stickyCells.forEach((cell) => {
        if (cell === column) {
          // This is the current column, so set the left offset and return
          cell.style.left = `${leftOffset}px`;
          return;
        }

        // This is a previous sticky column, so add its width to the offset
        leftOffset += cell.offsetWidth;
      });
    });
  }, [pinnedColumns]);

  const handleCheckboxChange = (key) => {
    setPinnedColumns((cols) => ({ ...cols, [key]: !cols[key] }));
  };

  const reorderedColumns = useMemo(() => {
    return columns
      .map((c, idx) => ({ ...c, initialPosition: idx }))
      .sort((a, b) =>
        pinnedColumns[a.key] === pinnedColumns[b.key]
          ? a.initialPosition - b.initialPosition
          : pinnedColumns[b.key] - pinnedColumns[a.key]
      );
  }, [pinnedColumns, columns]);

  return (
    <div ref={tableWrapperRef} className={s["table-wrapper"]}>
      <table ref={tableRef} cellSpacing={0}>
        <thead>
          <tr>
            {reorderedColumns.map(({ key, label, isSticky }) => (
              <th
                key={key}
                className={cx({
                  [s["is-sticky"]]: Boolean(isSticky),
                  [s["is-pinned"]]: pinnedColumns[key],
                })}
              >
                <div className="inline">
                  <input
                    type="checkbox"
                    id={`${checkBoxId}-${key}`}
                    checked={pinnedColumns[key]}
                    onChange={() => handleCheckboxChange(key)}
                  />
                  <label htmlFor={`${checkBoxId}-${key}`}>{label}</label>
                  <TableOptions tableScrollRef={tableWrapperRef} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {reorderedColumns.map(({ key, isSticky }) => (
                <td
                  key={key}
                  className={cx({
                    [s["is-sticky"]]: Boolean(isSticky),
                    [s["is-pinned"]]: pinnedColumns[key],
                  })}
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
