/**
 * Reusable Heatmap Component
 *
 * Usage:
 *   const heatmap = new Heatmap(containerElement, options);
 *   heatmap.setData(data);
 *   heatmap.render();
 *
 * Options:
 *   - cellSize: Size of each cell in pixels (default: 10)
 *   - cellGap: Gap between cells in pixels (default: 1)
 *   - colorScale: Function that maps normalized value (0-1) to color
 *   - onCellClick: Callback when cell is clicked (cell) => {}
 *   - onCellHover: Callback when cell is hovered (cell) => {}
 */

class Heatmap {
  constructor(container, options = {}) {
    this.container = container;

    // Configuration
    this.config = {
      cellSize: options.cellSize || 10,
      cellGap: options.cellGap || 1,
      labelWidth: options.labelWidth || 120,
      labelHeight: options.labelHeight || 30,
      marginTop: options.marginTop || 30,
      marginBottom: options.marginBottom || 20,
      marginLeft: options.marginLeft || 10,
      marginRight: options.marginRight || 10,
      colorScale: options.colorScale || this._defaultColorScale.bind(this),
      onCellClick: options.onCellClick || null,
      onCellHover: options.onCellHover || null
    };

    // State
    this.data = null;
    this.gridData = null;
    this.maxValue = 0;
    this.canvas = null;
    this.ctx = null;
    this.hoveredCell = null;

    this._init();
  }

  _init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'block';
    this.canvas.style.cursor = 'crosshair';
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    // Event listeners
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
    this.canvas.addEventListener('mouseleave', this._onMouseLeave.bind(this));
    this.canvas.addEventListener('click', this._onClick.bind(this));
    window.addEventListener('resize', this._onResize.bind(this));
  }

  /**
   * Set data for the heatmap
   * @param {Object} data - Data structure with rows, columns, and values
   * Expected format:
   * {
   *   rows: [{id: 'row1', label: 'Row 1', color: '#00ffff'}, ...],
   *   columns: [{id: 'col1', label: '1'}, ...],
   *   values: {row1: {col1: 10, col2: 5}, row2: {...}}
   * }
   */
  setData(data) {
    this.data = data;
    this._processData();
    this._resize();
  }

  _processData() {
    if (!this.data) return;

    // Find max value for normalization
    this.maxValue = 0;
    Object.values(this.data.values).forEach(row => {
      Object.values(row).forEach(value => {
        this.maxValue = Math.max(this.maxValue, value);
      });
    });
  }

  _resize() {
    const dpr = window.devicePixelRatio || 1;

    const totalCellWidth = this.config.cellSize + this.config.cellGap;
    const numRows = this.data.rows.length;
    const numCols = this.data.columns.length;

    const width =
      this.config.labelWidth +
      this.config.marginLeft +
      (numCols * totalCellWidth) +
      this.config.marginRight;

    const height =
      this.config.marginTop +
      (numRows * totalCellWidth) +
      this.config.labelHeight +
      this.config.marginBottom;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.ctx.scale(dpr, dpr);
  }

  _defaultColorScale(normalizedValue) {
    // Color scale: black → grey → cyan
    if (normalizedValue === 0) {
      return '#000000';
    } else if (normalizedValue < 0.3) {
      const t = normalizedValue / 0.3;
      const grey = Math.floor(t * 68);
      return `rgb(${grey}, ${grey}, ${grey})`;
    } else {
      const t = (normalizedValue - 0.3) / 0.7;
      const r = Math.floor(68 * (1 - t));
      const g = Math.floor(68 + (255 - 68) * t);
      const b = Math.floor(68 + (255 - 68) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }

  render() {
    if (!this.data) return;

    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    // Clear
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, width, height);

    const totalCellWidth = this.config.cellSize + this.config.cellGap;
    const gridStartX = this.config.labelWidth + this.config.marginLeft;
    const gridStartY = this.config.marginTop;

    // Draw rows
    this.data.rows.forEach((row, rowIndex) => {
      const y = gridStartY + rowIndex * totalCellWidth;

      // Row label
      this.ctx.fillStyle = row.color || '#00ffff';
      this.ctx.font = '11px Courier New';
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(
        row.label,
        this.config.labelWidth - 10,
        y + this.config.cellSize / 2
      );

      // Draw cells for this row
      this.data.columns.forEach((col, colIndex) => {
        const x = gridStartX + colIndex * totalCellWidth;
        const value = this.data.values[row.id]?.[col.id] || 0;
        const normalizedValue = this.maxValue > 0 ? value / this.maxValue : 0;

        const color = this.config.colorScale(normalizedValue);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.config.cellSize, this.config.cellSize);

        // Highlight hovered cell
        if (this.hoveredCell &&
            this.hoveredCell.rowIndex === rowIndex &&
            this.hoveredCell.colIndex === colIndex) {
          this.ctx.strokeStyle = '#ffffff';
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(
            x - 1,
            y - 1,
            this.config.cellSize + 2,
            this.config.cellSize + 2
          );
        }
      });
    });

    // Draw column labels
    this.ctx.fillStyle = '#666666';
    this.ctx.font = '10px Courier New';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';

    this.data.columns.forEach((col, colIndex) => {
      if (col.showLabel !== false) {
        const x = gridStartX + colIndex * totalCellWidth + this.config.cellSize / 2;
        const y = gridStartY + this.data.rows.length * totalCellWidth + 8;
        this.ctx.fillText(col.label, x, y);
      }
    });
  }

  _getCellFromPosition(mouseX, mouseY) {
    if (!this.data) return null;

    const rect = this.canvas.getBoundingClientRect();
    const x = mouseX - rect.left;
    const y = mouseY - rect.top;

    const totalCellWidth = this.config.cellSize + this.config.cellGap;
    const gridStartX = this.config.labelWidth + this.config.marginLeft;
    const gridStartY = this.config.marginTop;

    const colIndex = Math.floor((x - gridStartX) / totalCellWidth);
    const rowIndex = Math.floor((y - gridStartY) / totalCellWidth);

    if (rowIndex >= 0 && rowIndex < this.data.rows.length &&
        colIndex >= 0 && colIndex < this.data.columns.length) {

      const row = this.data.rows[rowIndex];
      const col = this.data.columns[colIndex];
      const value = this.data.values[row.id]?.[col.id] || 0;

      return {
        rowIndex,
        colIndex,
        row,
        col,
        value
      };
    }

    return null;
  }

  _onMouseMove(e) {
    const cell = this._getCellFromPosition(e.clientX, e.clientY);

    if (cell) {
      this.hoveredCell = cell;

      if (this.config.onCellHover) {
        this.config.onCellHover(cell);
      }
    } else {
      this.hoveredCell = null;

      if (this.config.onCellHover) {
        this.config.onCellHover(null);
      }
    }

    this.render();
  }

  _onMouseLeave() {
    this.hoveredCell = null;

    if (this.config.onCellHover) {
      this.config.onCellHover(null);
    }

    this.render();
  }

  _onClick(e) {
    const cell = this._getCellFromPosition(e.clientX, e.clientY);

    if (cell && this.config.onCellClick) {
      this.config.onCellClick(cell);
    }
  }

  _onResize() {
    if (this.data) {
      this._resize();
      this.render();
    }
  }

  destroy() {
    window.removeEventListener('resize', this._onResize.bind(this));
    this.canvas.remove();
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Heatmap;
}
