import React from "react";

const BigEyeSVG = React.forwardRef((props, ref) => (
  <svg id="big-eye" ref={ref} viewBox="0 0 130 60">
    <defs>
      <radialGradient id="irisGradient">
        <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
      </radialGradient>
    </defs>
    <path d="M 5,30 C 25,5 105,5 125,30 C 105,55 25,55 5,30 Z" fill="none" />
    <g id="iris-pupil-group" transform="translate(15, 0)">
      <circle cx="50" cy="30" r="14" fill="url(#irisGradient)" />
      <circle cx="50" cy="30" r="6" fill="rgba(0,0,0,0.7)" />
      <circle cx="55" cy="25" r="2.5" fill="rgba(255,255,255,0.8)" />
    </g>
    <g id="eyelids-and-lashes">
      <path
        id="eyelid-top"
        d="M 5,30 C 25,10 105,10 125,30"
        stroke="#fff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        id="eyelashes"
        d="M30,20 Q35,10 42,14 M50,12 Q55,4 62,10 M70,10 Q75,4 82,12 M90,14 Q95,10 102,20"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        id="eyelid-bottom"
        d="M 5,30 C 25,50 105,50 125,30"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  </svg>
))

export default BigEyeSVG