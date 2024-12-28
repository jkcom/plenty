export const compilePath = (...segments: string[]) => {
  return "/" + segments.join("/");
};
