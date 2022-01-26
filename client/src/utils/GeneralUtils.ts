/**
 *  this function is for demonstration purposes
 * @param testString string to return
 * @returns a test string
 * @author Minh
 */
export const testFunction = (testString: string): string =>
  `this is a testfunction that returns: ${testString}`;

/**
 *  this function returns and array of truthy elements
 *  from an object with properties of only boolean type
 *  example: {vegan: false, glutenFree: true, vegetarian: true} => ["glutenFree", "vegetarian"];
 * @param object with
 * @returns a string array
 * @author Fadel
 */
/* eslint-disable array-callback-return */
export const convertObjToArr = (obj: any): string[] =>
  Object.keys(obj).filter((key: string) => {
    if (obj[key] === true) return key as string;
  }) as string[];
export const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

export const metaAdder = (queryProperty: string, value: string): void => {
  // Get an element if it exists already
  let element: Element | null = document.querySelector(
    `meta[${queryProperty}]`
  );

  // Check if the element exists
  if (element) {
    // If it does just change the content of the element
    element.setAttribute("content", value);
  } else {
    // It doesn't exist so lets make a HTML element string with the info we want
    let elementString = `<meta name="${queryProperty}" content="${value}" />`;
    // And insert it into the head
    document.head.insertAdjacentHTML("beforeend", elementString);
  }
};
