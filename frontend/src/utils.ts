export const getWordPosition = ({
  word,
  imgSize,
  customWidth,
  scale = 1,
}: {
  word: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  imgSize: {
    width: number;
    height: number;
  };
  customWidth: number;
  scale?: number;
}) => {
  const actualWidth = customWidth * scale;
  const actualHeight = (customWidth / imgSize.width) * imgSize.height * scale;

  return {
    top: word.top * (actualHeight / imgSize.height),
    right: (word.left + word.width) * (actualWidth / imgSize.width),
    bottom: (word.top + word.height) * (actualHeight / imgSize.height),
    left: word.left * (actualWidth / imgSize.width),
    width: word.width * (actualWidth / imgSize.width),
    height: word.height * (actualHeight / imgSize.height),
  };
};

export const checkWordInArea = ({
  word,
  imgSize,
  customWidth,
  area,
  scale = 1,
}: {
  word: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  imgSize: {
    width: number;
    height: number;
  };
  customWidth: number;
  area: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  scale?: number;
}) => {
  const { top, right, bottom, left } = getWordPosition({
    word,
    imgSize,
    customWidth,
    scale,
  });
  const endX = area.left + area.width;
  const endY = area.top + area.height;

  if (top < endY && right >= area.left && bottom >= area.top && left <= endX) {
    return true;
  }

  return false;
};
