import { StaticImageData } from "next/image";

declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}

declare module "*.png" {
  const content: StaticImageData;
  export default content;
}

declare module "*.jpg" {
  const content: StaticImageData;
  export default content;
}

declare module "*.jpeg" {
  const content: StaticImageData;
  export default content;
}
