
const historyTracker = {
    history: [],
    currentIndex: -1,
  
    push(path) {
        if (this.history[this.currentIndex] === path) {
          return
        }
        
        this.history = this.history.slice(0, this.currentIndex + 1)
        this.history.push(path)
        this.currentIndex++;
    },

    back() {
      if (this.currentIndex > 0) {
        this.currentIndex--
        return this.history[this.currentIndex]
      }
      return null
    },
  
    next() {
      if (this.currentIndex < this.history.length - 1) {
        this.currentIndex++
        return this.history[this.currentIndex]
      }
      return null
    }
  }
  
  export default historyTracker
  