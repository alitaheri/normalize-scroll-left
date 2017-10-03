import { expect } from 'chai';
import {
  detectScrollType,
  _setScrollType,
  getNormalizedScrollLeft,
  setNormalizedScrollLeft,
} from './main';

describe('detectScrollType', () => {

  it('should return indeterminate in node environment', () => {
    expect(detectScrollType()).to.be.equals('indeterminate');
  });

});

describe('getNormalizedScrollLeft (scrollWidth=100, clientWidth=20)', () => {
  const mock: any = { scrollWidth: 100, clientWidth: 20, scrollLeft: 50 };

  it('should get the original scroll left when direction=ltr despite of type', () => {
    _setScrollType('indeterminate');
    expect(getNormalizedScrollLeft(mock, 'ltr')).to.be.equals(50);
    _setScrollType('default');
    expect(getNormalizedScrollLeft(mock, 'ltr')).to.be.equals(50);
    _setScrollType('negative');
    expect(getNormalizedScrollLeft(mock, 'ltr')).to.be.equals(50);
    _setScrollType('reverse');
    expect(getNormalizedScrollLeft(mock, 'ltr')).to.be.equals(50);
  });

  it('should return NaN when direction=rtl, type=indeterminate', () => {
    _setScrollType('indeterminate');
    expect(getNormalizedScrollLeft(mock, 'rtl')).to.be.NaN;
  });

  it('should return 30 when Element.scrollLeft=30, direction=rtl, type=default', () => {
    _setScrollType('default');
    expect(getNormalizedScrollLeft({ ...mock, scrollLeft: 30 }, 'rtl')).to.be.equals(30);
  });

  it('should return 30 when Element.scrollLeft=-50, direction=rtl, type=negative', () => {
    _setScrollType('negative');
    expect(getNormalizedScrollLeft({ ...mock, scrollLeft: -50 }, 'rtl')).to.be.equals(30);
  });

  it('should return 30 when Element.scrollLeft=50, direction=rtl, type=reverse', () => {
    _setScrollType('reverse');
    expect(getNormalizedScrollLeft({ ...mock, scrollLeft: 50 }, 'rtl')).to.be.equals(30);
  });

});

describe('setNormalizedScrollLeft (scrollWidth=100, clientWidth=20)', () => {
  const makeMock: any = () => ({ scrollWidth: 100, clientWidth: 20, scrollLeft: 50 });

  it('should set the original scroll left when direction=ltr despite of type', () => {
    _setScrollType('indeterminate');
    let mock = makeMock();
    setNormalizedScrollLeft(mock, 80, 'ltr');
    expect(mock.scrollLeft).to.be.equals(80);

    _setScrollType('default');
    mock = makeMock();
    setNormalizedScrollLeft(mock, 80, 'ltr');
    expect(mock.scrollLeft).to.be.equals(80);

    _setScrollType('negative');
    mock = makeMock();
    setNormalizedScrollLeft(mock, 80, 'ltr');
    expect(mock.scrollLeft).to.be.equals(80);

    _setScrollType('reverse');
    mock = makeMock();
    setNormalizedScrollLeft(mock, 80, 'ltr');
    expect(mock.scrollLeft).to.be.equals(80);
  });

  it('should do nothing when direction=rtl, type=indeterminate', () => {
    _setScrollType('indeterminate');
    const mock = makeMock();
    setNormalizedScrollLeft(mock, 80, 'rtl');
    expect(mock.scrollLeft).to.be.equals(50);
  });

  it('should set Element.scrollLeft=30 when scrollLeft=30, direction=rtl, type=default', () => {
    _setScrollType('default');
    const mock = { ...makeMock(), scrollLeft: 50 };
    setNormalizedScrollLeft(mock, 30, 'rtl');
    expect(mock.scrollLeft).to.be.equals(30);
  });

  it('should set Element.scrollLeft=-50 when scrollLeft=30, direction=rtl, type=negative', () => {
    _setScrollType('negative');
    const mock = { ...makeMock(), scrollLeft: -40 };
    setNormalizedScrollLeft(mock, 30, 'rtl');
    expect(mock.scrollLeft).to.be.equals(-50);
  });

  it('should return Element.scrollLeft=50 when scrollLeft=30, direction=rtl, type=reverse', () => {
    _setScrollType('reverse');
    const mock = { ...makeMock(), scrollLeft: 60 };
    setNormalizedScrollLeft(mock, 30, 'rtl');
    expect(mock.scrollLeft).to.be.equals(50);
  });

});
