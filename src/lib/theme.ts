// The stored theme choice. Read before first paint by THEME_SCRIPT in the root layout, and written by
// the theme switch. "system" is stored as the absence of a value.
export const THEME_KEY = "proof-theme";

export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
