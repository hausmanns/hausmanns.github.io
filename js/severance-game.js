// Severance Numbers Game - Easter Egg
// This is a recreation of the numbers refining game from the TV show Severance

// Utility to generate random numbers
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Class for the Drop Zone component
class DropZone extends React.Component {
  render() {
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
    }, this.props.numbers.map((num, idx) => 
      React.createElement('span', { 
        key: idx, 
        className: 'dropped-number'
      }, num)
    ));
  }
}

// Main SeveranceGame component
class SeveranceGame extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      numbers: [],
      selected: new Set(),
      dropZones: [[], [], [], []],
      dragOverZone: null,
      progress: 0,
      complete: false,
      targetProgress: 100,
      isDragging: false,
      selectionStart: null,
      selectionEnd: null,
      isSelecting: false
    };

    this.gameRef = React.createRef();
    this.numbersRef = React.createRef();
  }

  componentDidMount() {
        const numbers = [];
    
    for (let i = 0; i < 100; i++) {
      numbers.push({
        id: i,
        value: generateRandomNumber(0, 10),
        isSpawning: true,
        style: {
          '--x-radius': `${generateRandomNumber(5, 10)}px`,
          '--y-radius': `${generateRandomNumber(5, 10)}px`,
          '--start-angle': `${generateRandomNumber(0, 360)}deg`,
          '--duration': `${generateRandomNumber(6, 20)}s`
        }
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

    // Get all selected numbers
    const selectedNumbers = [];
    this.state.selected.forEach(idx => {
      selectedNumbers.push(this.state.numbers[idx].value);
    });

    // Update drop zones
    const dropZones = [...this.state.dropZones];
    dropZones[zoneId] = [...dropZones[zoneId], ...selectedNumbers];

    // Calculate new progress
    let totalNumbers = 0;
    dropZones.forEach(zone => {
      totalNumbers += zone.length;
    });
    
    const progress = Math.min(Math.floor((totalNumbers / 40) * 100), this.state.targetProgress);
    const complete = progress >= this.state.targetProgress;

    // Generate new numbers for selected positions with spawning animation
    const numbers = [...this.state.numbers];
    this.state.selected.forEach(idx => {
      numbers[idx] = {
        ...numbers[idx],
        value: generateRandomNumber(0, 10),
        isSpawning: true // Add spawning flag
      };
    });

    this.setState({
      numbers,
      selected: new Set(),
      dropZones,
      dragOverZone: null,
      progress,
      complete
    });

    // Remove spawning flag after animation completes
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
      numbers.push({
        id: i,
        value: generateRandomNumber(0, 10),
        isSpawning: true
      });
    }
    
    this.setState({
      numbers,
      selected: new Set(),
      dropZones: [[], [], [], []],
      dragOverZone: null,
      progress: 0,
      complete: false
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

  render() {
    const selectionBox = this.state.isSelecting && this.state.selectionStart && this.state.selectionEnd
      ? this.getSelectionBox(this.state.selectionStart, this.state.selectionEnd)
      : null;

    // Create numbers with spawn animation class and use stored animation properties
    const numberElements = this.state.numbers.map((num, idx) => {
      return React.createElement('div', {
        key: idx,
        className: `number-cell ${this.state.selected.has(idx) ? 'selected' : ''} ${num.isSpawning ? 'spawning' : ''}`,
        draggable: this.state.selected.has(idx) && !this.state.isSelecting, // Only allow dragging when selected and not currently selecting
        style: num.style
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

    // Create drop zones
    const dropZones = [];
    for (let i = 0; i < 4; i++) {
      dropZones.push(
        React.createElement(DropZone, {
          key: i,
          id: i,
          isDragOver: this.state.dragOverZone === i,
          onDragEnter: (id) => this.setState({ dragOverZone: id }),
          onDragLeave: () => this.setState({ dragOverZone: null }),
          onDrop: this.handleDrop,
          numbers: this.state.dropZones[i]
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
      ])
    ]);
  }
}

// Wait for DOM to be ready and render the game
document.addEventListener('DOMContentLoaded', function() {
  // Create GSAP animation to fade in the easter egg when user scrolls to it
  gsap.registerPlugin(ScrollTrigger);
  
  gsap.to('.easter-egg-section', {
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'bottom bottom',
      end: 'bottom top',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        // Ensure the game is rendered when the section becomes visible
        if (!window.gameRendered) {
          ReactDOM.render(
            React.createElement(SeveranceGame),
            document.getElementById('severance-game')
          );
          window.gameRendered = true;
        }
      }
    },
    opacity: 1,
    duration: 1.5,
    ease: "power2.out"
  });
  
  // Also handle explicit navigation to the easter egg (in case scrollTrigger doesn't fire)
  if (window.location.hash === '#easter-egg') {
    document.querySelector('.easter-egg-section').style.opacity = 1;
    if (!window.gameRendered) {
      ReactDOM.render(
        React.createElement(SeveranceGame),
        document.getElementById('severance-game')
      );
      window.gameRendered = true;
    }
  }
});