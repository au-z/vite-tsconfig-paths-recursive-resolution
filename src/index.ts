import { A } from "@moduleA";
import { B } from "@moduleB";

/**
 * Expected Output

 * MODULE A
 * MODULE B: MODULE C
 */

function Paragraph(content) {
  const el = document.createElement("p");
  el.innerText = content;
  return el;
}

document.body.appendChild(Paragraph(A()));
document.body.appendChild(Paragraph(B()));

/**
 * Failed to resolve import "@moduleC" from "modules/moduleB.ts". Does the file exist?
 */
