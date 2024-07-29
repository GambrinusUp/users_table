import { useRef } from "react";

export function createHeaders(headers) {
  return headers.map((item) => ({
    text: item,
    ref: useRef(),
  }));
}
