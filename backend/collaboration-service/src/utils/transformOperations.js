export function transformOperation(opA, opB) {
  if (opA.type === "insert" && opB.type === "insert") {
    if (opA.index <= opB.index) {
      return { ...opB, index: opB.index + opA.text.length }; // Shift insert forward
    }
  }

  if (opA.type === "delete" && opB.type === "insert") {
    if (opB.index <= opA.index) {
      return opB; // No shift needed
    }
    return { ...opB, index: Math.max(opA.index, opB.index - opA.length) };
  }

  if (opA.type === "insert" && opB.type === "delete") {
    if (opB.index >= opA.index) {
      return { ...opB, index: opB.index + opA.text.length }; // Adjust delete position
    }
  }

  if (opA.type === "delete" && opB.type === "delete") {
    if (opB.index >= opA.index) {
      return { ...opB, index: Math.max(opA.index, opB.index - opA.length) }; // Adjust delete index
    }
  }

  return opB; // No transformation needed
}
