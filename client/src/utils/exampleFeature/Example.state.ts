import { atom, RecoilState } from "recoil";
import { ExampleInterface } from "./Example.types";

export const exampleState: RecoilState<ExampleInterface> = atom({
  key: "exampleState",
  default: { name: "", id: "some random id" },
});
