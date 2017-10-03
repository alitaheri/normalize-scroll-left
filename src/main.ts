export type ScrollType = 'indeterminate' | 'default' | 'negative' | 'reverse';

// Based on https://stackoverflow.com/a/31090240
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');

let cachedType: ScrollType;

export function _setScrollType(type?: ScrollType): void {
  cachedType = type!;
}

// Based on the jquery plugin https://github.com/othree/jquery.rtl-scroll-type
export function detectScrollType(): ScrollType {
  if (cachedType) {
    return cachedType;
  }

  if (!isBrowser() || !document || !document.body) {
    return 'indeterminate';
  }

  const dummy = document.createElement('div');

  dummy.appendChild(document.createTextNode('ABCD'));
  dummy.dir = 'rtl';
  dummy.style.fontSize = '14px';
  dummy.style.width = '4px';
  dummy.style.height = '1px';
  dummy.style.position = 'absolute';
  dummy.style.top = '-1000px';
  dummy.style.overflow = 'scroll';

  document.body.appendChild(dummy);

  cachedType = 'reverse';

  if (dummy.scrollLeft > 0) {
    cachedType = 'default';
  } else {
    dummy.scrollLeft = 1;
    if (dummy.scrollLeft === 0) {
      cachedType = 'negative';
    }
  }

  document.body.removeChild(dummy);
  return cachedType;
}

// Based on https://stackoverflow.com/a/24394376
export function getNormalizedScrollLeft(element: HTMLElement, direction: 'rtl' | 'ltr'): number {
  const scrollLeft = element.scrollLeft;

  // Perform the calculations only when direction is rtl to avoid messing up the ltr bahavior
  if (direction !== 'rtl') {
    return scrollLeft;
  }

  const type = detectScrollType();

  if (type === 'indeterminate') {
    return Number.NaN;
  }

  switch (type) {
    case 'negative':
      return element.scrollWidth - element.clientWidth + scrollLeft;
    case 'reverse':
      return element.scrollWidth - element.clientWidth - scrollLeft;
  }

  return scrollLeft;
}

export function setNormalizedScrollLeft(
  element: HTMLElement,
  scrollLeft: number,
  direction: 'rtl' | 'ltr',
): void {
  // Perform the calculations only when direction is rtl to avoid messing up the ltr bahavior
  if (direction !== 'rtl') {
    element.scrollLeft = scrollLeft;
    return;
  }

  const type = detectScrollType();

  if (type === 'indeterminate') {
    return;
  }

  switch (type) {
    case 'negative':
      element.scrollLeft = element.clientWidth - element.scrollWidth + scrollLeft;
      break;
    case 'reverse':
      element.scrollLeft = element.scrollWidth - element.clientWidth - scrollLeft;
      break;
    default:
      element.scrollLeft = scrollLeft;
      break;
  }
}
