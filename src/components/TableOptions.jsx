import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import { useClickOutside } from "../utils/useClickOutside";
import cx from "classnames";
import s from "./options.module.scss";

export const TableOptions = ({ tableScrollRef }) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
  });
  const [isOpen, setIsOpen] = useState(false);
  const hideContextMenu = () => {
    setIsOpen(false);
    referenceElement.blur();
  };
  const menuRef = useClickOutside(hideContextMenu);

  useEffect(() => {
    const element = tableScrollRef.current;
    if (element) element.addEventListener("scroll", hideContextMenu);

    return () => element.removeEventListener("scroll", hideContextMenu);
  }, [tableScrollRef.current]);

  return (
    <div ref={menuRef}>
      <button
        className={s.cta}
        ref={setReferenceElement}
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 16 16" width="16" height="16">
          <circle cx="8" cy="3" r="1.5"></circle>
          <circle cx="8" cy="8" r="1.5"></circle>
          <circle cx="8" cy="13" r="1.5"></circle>
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={setPopperElement}
            style={styles.popper}
            className={cx(s.popper, "stack")}
            {...attributes.popper}
          >
            <div>Pin / Unpin</div>
            <div>Stick / Unstick</div>
            <div>Hide / Show</div>
            <div>Sort in Ascending Order</div>
            <div>Sort in Descending Order</div>
          </div>,
          document.querySelector("#portals")
        )}
    </div>
  );
};
