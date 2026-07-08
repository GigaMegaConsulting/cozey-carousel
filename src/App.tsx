import { Carousel } from "./components/Carousel";
import { media } from "./data/media";

export default function App() {
  return (
    <main>
      <Carousel items={media} heading="A day in the life" />
    </main>
  );
}
