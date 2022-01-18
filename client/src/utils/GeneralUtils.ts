/**
 *  this function is for demonstration purposes
 * @param testString string to return
 * @returns a test string
 * @author Minh
 */
export const testFunction = (testString: string): string =>
  `this is a testfunction that returns: ${testString}`;

export const openInNewTab = (url: string): void => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};
