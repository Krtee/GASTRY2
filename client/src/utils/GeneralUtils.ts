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
