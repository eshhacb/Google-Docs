export function transformOperation(prevOp, newOp) {
    if (prevOp.type === "insert" && newOp.type === "insert") {
      if (newOp.index <= prevOp.index) {
        return { ...newOp, index: newOp.index }; // Keep index the same if before or at same position
      }
      return { ...newOp, index: newOp.index + prevOp.text.length }; // Shift forward
    }
  
    if (prevOp.type === "delete" && newOp.type === "insert") {
      if (newOp.index <= prevOp.index) {
        return { ...newOp, index: newOp.index }; // No shift needed
      }
      return { ...newOp, index: Math.max(prevOp.index, newOp.index - prevOp.length) }; // Adjust index
    }
  
    if (prevOp.type === "insert" && newOp.type === "delete") {
      if (newOp.index >= prevOp.index) {
        return { ...newOp, index: newOp.index + prevOp.text.length }; // Shift delete forward
      }
    }
  
    if (prevOp.type === "delete" && newOp.type === "delete") {
      if (newOp.index >= prevOp.index) {
        return { ...newOp, index: Math.max(prevOp.index, newOp.index - prevOp.length) }; // Adjust delete index
      }
    }
  
    return newOp; // No transformation needed
  }
  