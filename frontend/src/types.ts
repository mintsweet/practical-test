export interface ILine {
  text: string;
  minTop: number;
  minHeight: number;
  words: Array<{
    text: string;
    top: number;
    left: number;
    width: number;
    height: number;
  }>;
}
