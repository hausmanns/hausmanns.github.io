// Severance Numbers Game - Easter Egg
// This is a recreation of the numbers refining game from the TV show Severance

// Utility to generate random numbers
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Class for the Drop Zone component
class DropZone extends React.Component {
  render() {
    const percentage = (this.props.score / 250) * 100; // Calculate percentage based on max 250 score
    return React.createElement('div', {
      className: `drop-zone ${this.props.isDragOver ? 'dragover' : ''}`,
      onDragOver: (e) => {
        e.preventDefault();
        if (!this.props.isDragOver) {
          this.props.onDragEnter(this.props.id);
        }
      },
      onDragLeave: (e) => {
        e.preventDefault();
        this.props.onDragLeave();
      },
      onDrop: (e) => {
        e.preventDefault();
        this.props.onDrop(this.props.id);
      }
    }, [
      // Show only progress bar, no score
      React.createElement('div', {
        key: 'progress-container',
        className: 'zone-progress-container'
      }, React.createElement('div', {
        key: 'progress',
        className: 'zone-progress-bar'
      }, React.createElement('div', {
        className: 'zone-progress',
        style: { width: `${percentage}%` }
      }))),
      // Numbers container
      React.createElement('div', {
        key: 'numbers',
        className: 'zone-numbers'
      }, this.props.numbers.map((num, idx) => 
        React.createElement('span', { 
          key: idx, 
          className: 'dropped-number'
        }, num)
      ))
    ]);
  }
}

// Main SeveranceGame component
class SeveranceGame extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      numbers: [],
      selected: new Set(),
      dropZones: [[], [], []], // Changed to 3 zones
      zoneScores: [0, 0, 0], // Changed to 3 scores
      dragOverZone: null,
      progress: 0,
      complete: false,
      targetProgress: 100,
      isDragging: false,
      selectionStart: null,
      selectionEnd: null,
      isSelecting: false,
      gameOver: false,
      gameWon: false,
      mainProgress: 0
    };

    this.gameRef = React.createRef();
    this.numbersRef = React.createRef();
  }

  generateNumber() {
    // Update font size range to ensure max score of 1000 (25 numbers per zone * 40 max font size)
    const fontSize = generateRandomNumber(14, 40);
    return {
      value: generateRandomNumber(0, 10),
      fontSize: fontSize,
      style: {
        '--x-radius': `${generateRandomNumber(5, 10)}px`,
        '--y-radius': `${generateRandomNumber(5, 10)}px`,
        '--start-angle': `${generateRandomNumber(0, 360)}deg`,
        '--duration': `${generateRandomNumber(6, 20)}s`,
        '--font-size': `${fontSize}px`
      }
    };
  }

  componentDidMount() {
    const numbers = [];
    
    for (let i = 0; i < 100; i++) {
      const number = this.generateNumber();
      numbers.push({
        id: i,
        ...number,
        isSpawning: true
      });
    }
    
    this.setState({ numbers });

    // Remove spawning flag after initial animation but keep the unique styles
    setTimeout(() => {
      this.setState(prevState => ({
        numbers: prevState.numbers.map(num => ({
          ...num,
          isSpawning: false
        }))
      }));
    }, 500);

    // Add mouse event listeners for drag selection
    if (this.numbersRef.current) {
      this.numbersRef.current.addEventListener('mousedown', this.startSelection);
      window.addEventListener('mousemove', this.updateSelection);
      window.addEventListener('mouseup', this.endSelection);
    }
  }

  componentWillUnmount() {
    if (this.numbersRef.current) {
      this.numbersRef.current.removeEventListener('mousedown', this.startSelection);
      window.removeEventListener('mousemove', this.updateSelection);
      window.removeEventListener('mouseup', this.endSelection);
    }
  }

  startSelection = (e) => {
    if (!this.numbersRef.current) return;

    // Get the clicked element
    const clickedElement = e.target;
    // Check if we clicked on a number cell that's already selected
    if (clickedElement.classList.contains('number-cell') && clickedElement.classList.contains('selected')) {
      // Don't start selection if clicking on already selected numbers
      return;
    }
    
    const rect = this.numbersRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    this.setState({
      isSelecting: true,
      selectionStart: { x: mouseX, y: mouseY },
      selectionEnd: { x: mouseX, y: mouseY },
      selected: new Set() // Clear any existing selection
    });
  }

  updateSelection = (e) => {
    if (!this.state.isSelecting || !this.numbersRef.current) return;

    const rect = this.numbersRef.current.getBoundingClientRect();
    const end = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    // Only update selection-related state
    this.setState(prevState => {
      const selected = new Set();
      const selectionBox = this.getSelectionBox(prevState.selectionStart, end);

      Array.from(this.numbersRef.current.children).forEach((element, idx) => {
        if (idx >= prevState.numbers.length) return;
        
        const rect = element.getBoundingClientRect();
        const numRect = {
          left: rect.left - this.numbersRef.current.getBoundingClientRect().left,
          top: rect.top - this.numbersRef.current.getBoundingClientRect().top,
          width: rect.width,
          height: rect.height
        };
        
        if (this.isElementInSelectionBox(numRect, selectionBox)) {
          selected.add(idx);
        }
      });

      return {
        selectionEnd: end,
        selected
      };
    });
  }

  endSelection = () => {
    this.setState({ isSelecting: false });
  }

  getSelectionBox = (start, end) => {
    return {
      left: Math.min(start.x, end.x),
      top: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y)
    };
  }

  isElementInSelectionBox = (element, box) => {
    return !(element.left > box.left + box.width || 
             element.left + element.width < box.left || 
             element.top > box.top + box.height ||
             element.top + element.height < box.top);
  }

  handleDrop = (zoneId) => {
    if (this.state.selected.size === 0) return;

    // Get all selected numbers and their scores
    const selectedNumbers = [];
    let zoneScoreAdd = 0;
    
    this.state.selected.forEach(idx => {
      selectedNumbers.push(this.state.numbers[idx].value);
      zoneScoreAdd += Math.floor(this.state.numbers[idx].fontSize);
    });

    // Update drop zones and scores
    const dropZones = [...this.state.dropZones];
    const zoneScores = [...this.state.zoneScores];
    dropZones[zoneId] = [...dropZones[zoneId], ...selectedNumbers];
    zoneScores[zoneId] += zoneScoreAdd;

    // Calculate main progress independently (max 1000)
    const mainProgress = this.state.mainProgress + zoneScoreAdd;

    // Check win/lose conditions
    const allBoxesFull = zoneScores.every(score => score >= 250);
    const mainBarFull = mainProgress >= 1000;

    let gameOver = mainBarFull || allBoxesFull;
    let gameWon = allBoxesFull && !mainBarFull;

    // Generate new numbers for selected positions
    const numbers = [...this.state.numbers];
    this.state.selected.forEach(idx => {
      const newNumber = this.generateNumber();
      numbers[idx] = {
        ...numbers[idx],
        ...newNumber,
        isSpawning: true
      };
    });

    this.setState({
      numbers,
      selected: new Set(),
      dropZones,
      zoneScores,
      dragOverZone: null,
      mainProgress,
      gameOver,
      gameWon
    });

    // Remove spawning flag after animation
    setTimeout(() => {
      this.setState(prevState => ({
        numbers: prevState.numbers.map(num => ({
          ...num,
          isSpawning: false
        }))
      }));
    }, 500);
  }

  resetGame = () => {
    const numbers = [];
    
    for (let i = 0; i < 100; i++) {
      const number = this.generateNumber();
      numbers.push({
        id: i,
        ...number,
        isSpawning: true
      });
    }
    
    this.setState({
      numbers,
      dropZones: [[], [], []], // Changed to 3 zones
      zoneScores: [0, 0, 0], // Changed to 3 scores
      selected: new Set(),
      mainProgress: 0,
      gameOver: false,
      gameWon: false
    });

    // Remove spawning flag after animation but keep the circular motion
    setTimeout(() => {
      this.setState(prevState => ({
        numbers: prevState.numbers.map(num => ({
          ...num,
          isSpawning: false
        }))
      }));
    }, 500);
  }

  render() {
    const selectionBox = this.state.isSelecting && this.state.selectionStart && this.state.selectionEnd
      ? this.getSelectionBox(this.state.selectionStart, this.state.selectionEnd)
      : null;

    // Create numbers with spawn animation and font size
    const numberElements = this.state.numbers.map((num, idx) => {
      return React.createElement('div', {
        key: idx,
        className: `number-cell ${this.state.selected.has(idx) ? 'selected' : ''} ${num.isSpawning ? 'spawning' : ''}`,
        draggable: this.state.selected.has(idx) && !this.state.isSelecting, // Only allow dragging when selected and not currently selecting
        style: {
          ...num.style,
          fontSize: num.style['--font-size']
        }
      }, num.value);
    });

    // Create selection box if dragging
    const selectionBoxElement = selectionBox && React.createElement('div', {
      className: 'selection-box',
      style: {
        left: selectionBox.left + 'px',
        top: selectionBox.top + 'px',
        width: selectionBox.width + 'px',
        height: selectionBox.height + 'px'
      }
    });

    // Create drop zones with scores
    const dropZones = [];
    for (let i = 0; i < 3; i++) { // Changed to 3 zones
      dropZones.push(
        React.createElement(DropZone, {
          key: i,
          id: i,
          isDragOver: this.state.dragOverZone === i,
          onDragEnter: (id) => this.setState({ dragOverZone: id }),
          onDragLeave: () => this.setState({ dragOverZone: null }),
          onDrop: this.handleDrop,
          numbers: this.state.dropZones[i],
          score: this.state.zoneScores[i]
        })
      );
    }

    // Main game container
    return React.createElement('div', { 
      className: 'severance-game-container',
      ref: this.gameRef 
    }, [
      React.createElement('h2', { 
        key: 'title', 
        className: 'severance-title' 
      }, 'MACRO DATA REFINEMENT'),
      
      React.createElement('div', { 
        key: 'grid', 
        className: 'numbers-grid',
        ref: this.numbersRef
      }, [
        ...numberElements,
        selectionBoxElement
      ]),
      
      React.createElement('div', { 
        key: 'zones', 
        className: 'drop-zones' 
      }, dropZones),
      
      React.createElement('div', { 
        key: 'message', 
        className: 'game-message' 
      }, [
        React.createElement('div', { 
          key: 'text' 
        }, this.state.selected.size > 0 
          ? `${this.state.selected.size} numbers selected. Drag to a bin.` 
          : 'Click and drag to select numbers that feel scary or bad.'
        ),
        React.createElement('div', { 
          key: 'progress-bar', 
          className: 'progress-bar' 
        }, React.createElement('div', { 
          className: 'progress',
          style: { width: `${this.state.progress}%` }
        }))
      ]),
      
      React.createElement('div', {
        className: `congratulations ${this.state.complete ? 'show' : ''}`
      }, [
        React.createElement('h2', { key: 'title' }, 'You have been severed'),
        React.createElement('p', { key: 'message' }, 'Excellent work refining those numbers. The board is pleased.'),
        React.createElement('button', { 
          key: 'reset', 
          onClick: this.resetGame 
        }, 'Begin New Sequence')
      ]),

      // Update main progress bar to show only percentage
      React.createElement('div', {
        className: 'main-progress-container'
      }, [
        React.createElement('div', {
          key: 'bar',
          className: 'main-progress-bar'
        }, React.createElement('div', {
          className: 'main-progress',
          style: { width: `${(this.state.mainProgress / 1000) * 100}%` }
        }))
      ]),

      // Update congratulations screen with distinct success/failure states
      (this.state.gameOver || this.state.gameWon) && 
      React.createElement('div', {
        className: `congratulations show ${this.state.gameWon ? 'success' : 'failure'}`
      }, [
        React.createElement('h2', { 
          key: 'title',
          className: this.state.gameWon ? 'success-title' : 'failure-title'
        }, this.state.gameWon ? 'Refinement Complete' : 'CATASTROPHIC FAILURE'),
        React.createElement('div', { 
          key: 'message',
          className: this.state.gameWon ? 'success-message' : 'failure-message'
        }, this.state.gameWon 
          ? 'All data has been properly categorized. Your work meets our standards.'
          : ['Your inability to properly distribute the numbers has resulted in a critical system overload.',
             'The board is disappointed in your performance.',
             'You will be terminated.'].map((line, index) => 
              React.createElement('p', { key: index }, line)
          )),
        React.createElement('button', { 
          key: 'reset',
          className: this.state.gameWon ? 'success-button' : 'failure-button',
          onClick: this.resetGame 
        }, this.state.gameWon ? 'Process New Data' : 'RETRY SEQUENCE')
      ])
    ]);
  }
}

// Wait for DOM to be ready and render the game
document.addEventListener('DOMContentLoaded', function() {
  let forceScrollContainer = document.querySelector('.force-scroll-container');
  let isGameVisible = false;
  
  // Add click event listener to both triggers
  document.querySelectorAll('.easter-egg-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (!isGameVisible) {
        forceScrollContainer.classList.add('revealed');
        isGameVisible = true;
        
        if (!window.gameRendered) {
          ReactDOM.render(
            React.createElement(SeveranceGame),
            document.getElementById('severance-game')
          );
          window.gameRendered = true;
          document.querySelector('.easter-egg-section').style.opacity = '1';
        }
      }
      
      // Always scroll to game section when clicking triggers
      setTimeout(() => {
        forceScrollContainer.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    });
  });

  // Handle direct navigation to easter egg
  if (window.location.hash === '#easter-egg') {
    forceScrollContainer.classList.add('revealed');
    isGameVisible = true;
    document.querySelector('.easter-egg-section').style.opacity = '1';
    if (!window.gameRendered) {
      ReactDOM.render(
        React.createElement(SeveranceGame),
        document.getElementById('severance-game')
      );
      window.gameRendered = true;
    }
  }
});

// Remove GSAP-specific code since we're using our own scroll behavior