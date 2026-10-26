import React from "react";

export const Tab = (props) => {
  const {
    options,
    onChange = () => { },
    value,
    paddingY = 4,
    paddingX = 0,
    borderColor = "#4527a4",
    hoverColor = "#fff",
    hoverBg = "#774cff",
    activeBg = "#4527a4",
    activeColor = "#fff",
    style,
    className,
  } = props;
  const defaultTabs = options ?? [
    { label: "Tab 1", value: "tab1" },
    { label: "Tab 2", value: "tab2" },
  ];
  // const { options, onChange = () => { }, value, paddingY = 4, paddingX = 0, borderColor = "#4527a4", hoverColor = "#774cff", activeColor = "#4527a4", color = "#fff" } = props;
  const id = Math.floor(Math.random() * 99999999);
  return (
    <div>
      <style>
        {`
          #bpl-tab-${id}.bpl-tab {
            display: flex;
            justify-content: space-between;
            border: 1px solid ${borderColor};
            margin:8px 0px;
          }
          #bpl-tab-${id} .dynamic-${id}.isActive {
            background: ${activeBg};
            color: ${activeColor};
          }
          #bpl-tab-${id} .dynamic-${id}.single-bpl-tab {
            display: flex;
            width: 100%;
            justify-content: center;
            transition: background 0.2s ease-in-out;
            cursor: pointer;
            white-space:nowrap;
            border-right: 1px solid ${borderColor};
          }
          #bpl-tab-${id} .single-bpl-tab:last-child{
            border-right:0px
          }
          #bpl-tab-${id} .dynamic-${id}.single-bpl-tab p {
              margin: 0;
              font-size: 12px;
              padding: ${paddingY}px ${paddingX}px;
            }
          #bpl-tab-${id} .single-bpl-tab-hover:hover {
            color: ${hoverColor};
            background: ${hoverBg};
          }
        `}
      </style>
      <div
        style={style}
        id={`bpl-tab-${id}`}
        className={`bpl-tab ${className}`}
      >
        {defaultTabs?.map((tab, i) => (
          <div
            key={i}
            onClick={() => onChange(tab.value)}
            className={`dynamic-${id} single-bpl-tab ${value === tab.value ? "isActive" : "single-bpl-tab-hover"
              }`}
          >
            <p>{tab.label}</p>
          </div>
        ))}
      </div>
      {/* <div id={`bpl-tab-${id}`} className="bpl-tab">
        {options?.map((option, i) => (
          <div
            key={i}
            onClick={() => onChange(option.replace(/\s/g, "").toLowerCase())}
            className={`dynamic-${id} single-bpl-tab ${value === option.replace(/\s/g, "").toLowerCase()
              ? 'isActive'
              : 'single-bpl-tab-hover'
              }`}
          >
            <p style={{ textTransform: 'capitalize' }}>{option}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};
