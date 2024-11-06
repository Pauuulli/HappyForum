import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM("").window;
const dompurify = DOMPurify(window);

export { dompurify };
