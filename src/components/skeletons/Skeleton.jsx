const SHAPE_CLASSES = {
  rect: "rounded-md",
  circle: "rounded-full",
  text: "rounded-md h-3",
};

export default function Skeleton({ shape = "rect", className = "", style }) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton ${SHAPE_CLASSES[shape] ?? SHAPE_CLASSES.rect} ${className}`}
      style={style}
    />
  );
}
