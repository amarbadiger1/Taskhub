import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "TaskHub" },
    { name: "description", content: "Welcome to TaskHub!" },
  ];
}

export default function Home() {
  return <>
    Hello
  </>;
}
