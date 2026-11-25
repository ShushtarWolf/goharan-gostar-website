export function runGooey(opts: {
  canvas: HTMLCanvasElement;
  menu: HTMLElement;
  pictures: HTMLElement[];
  holds?: HTMLElement[];
}): () => void;

export function bootGooey(opts: {
  canvas: HTMLCanvasElement;
  menu: HTMLElement;
  pictures: HTMLElement[];
  holds?: HTMLElement[];
}): Promise<() => void>;
