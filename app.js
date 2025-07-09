class ParkingConstructor {
    constructor() {
        this.canvas = document.getElementById('parkingCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.grid = [];
        this.gridSize = 40;
        this.currentTool = 'parking-spot';
        this.isConstructorMode = true;
        this.carData = [];
        this.parkingSpots = [];
        
        this.initializeCanvas();
        this.setupEventListeners();
        this.drawGrid();
    }

    initializeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.cols = Math.floor(this.canvas.width / this.gridSize);
        this.rows = Math.floor(this.canvas.height / this.gridSize);
        
        // Initialize empty grid
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
    }

    setupEventListeners() {
        // Mode toggle
        document.getElementById('constructorMode').addEventListener('click', () => {
            this.switchMode(true);
        });

        document.getElementById('simulationMode').addEventListener('click', () => {
            this.switchMode(false);
        });

        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.type;
            });
        });

        // Canvas events
        this.canvas.addEventListener('click', (e) => {
            if (this.isConstructorMode) {
                this.handleCanvasClick(e);
            }
        });

        // Action buttons
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearGrid();
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveLayout();
        });

        document.getElementById('applyDataBtn').addEventListener('click', () => {
            this.applyCarData();
        });
    }

    switchMode(isConstructor) {
        this.isConstructorMode = isConstructor;
        
        if (isConstructor) {
            document.getElementById('constructorMode').classList.add('active');
            document.getElementById('simulationMode').classList.remove('active');
            document.getElementById('constructorToolbar').style.display = 'block';
            document.getElementById('simulationPanel').style.display = 'none';
            this.canvas.style.cursor = 'crosshair';
        } else {
            document.getElementById('simulationMode').classList.add('active');
            document.getElementById('constructorMode').classList.remove('active');
            document.getElementById('constructorToolbar').style.display = 'none';
            document.getElementById('simulationPanel').style.display = 'block';
            this.canvas.style.cursor = 'default';
        }
        
        this.redraw();
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor(x / this.gridSize);
        const row = Math.floor(y / this.gridSize);
        
        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            this.grid[row][col] = this.currentTool;
            this.redraw();
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }

    drawElement(row, col, type, occupied = false) {
        const x = col * this.gridSize;
        const y = row * this.gridSize;
        
        switch (type) {
            case 'parking-spot':
                this.ctx.fillStyle = occupied ? '#ffebee' : '#e8f5e8';
                this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
                this.ctx.strokeStyle = '#34495e';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
                
                if (occupied) {
                    this.drawCar(x + this.gridSize/2, y + this.gridSize/2);
                }
                break;
                
            case 'road':
                this.ctx.fillStyle = '#95a5a6';
                this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
                break;
                
            case 'wall':
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
                break;
                
            case 'entrance':
                this.ctx.fillStyle = '#27ae60';
                this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
                this.ctx.fillStyle = 'white';
                this.ctx.font = '16px Noto Sans';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('↑', x + this.gridSize/2, y + this.gridSize/2 + 5);
                break;
        }
    }

    drawCar(x, y) {
        const carWidth = 25;
        const carHeight = 15;
        
        // Car body
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillRect(x - carWidth/2, y - carHeight/2, carWidth, carHeight);
        
        // Car outline
        this.ctx.strokeStyle = '#2980b9';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x - carWidth/2, y - carHeight/2, carWidth, carHeight);
        
        // Windows
        this.ctx.fillStyle = '#85c1e9';
        this.ctx.fillRect(x - carWidth/2 + 3, y - carHeight/2 + 3, carWidth - 6, carHeight - 6);
        
        // Wheels
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(x - carWidth/2 + 2, y - carHeight/2 - 2, 4, 4);
        this.ctx.fillRect(x + carWidth/2 - 6, y - carHeight/2 - 2, 4, 4);
        this.ctx.fillRect(x - carWidth/2 + 2, y + carHeight/2 - 2, 4, 4);
        this.ctx.fillRect(x + carWidth/2 - 6, y + carHeight/2 - 2, 4, 4);
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        
        // Collect parking spots for simulation
        this.parkingSpots = [];
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col]) {
                    let occupied = false;
                    
                    if (this.grid[row][col] === 'parking-spot' && !this.isConstructorMode) {
                        this.parkingSpots.push({row, col});
                        occupied = this.isSpotOccupied(this.parkingSpots.length - 1);
                    }
                    
                    this.drawElement(row, col, this.grid[row][col], occupied);
                }
            }
        }
    }

    isSpotOccupied(spotIndex) {
        if (!this.carData || this.carData.length === 0) return false;
        
        let currentIndex = 0;
        for (let row = 0; row < this.carData.length; row++) {
            for (let col = 0; col < this.carData[row].length; col++) {
                if (currentIndex === spotIndex) {
                    return this.carData[row][col] === 1;
                }
                currentIndex++;
            }
        }
        return false;
    }

    clearGrid() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        this.redraw();
    }

    saveLayout() {
        const layout = {
            grid: this.grid,
            cols: this.cols,
            rows: this.rows,
            gridSize: this.gridSize
        };
        
        const dataStr = JSON.stringify(layout, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'parking_layout.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }

    applyCarData() {
        const input = document.getElementById('carDataInput').value.trim();
        const statusMsg = document.getElementById('statusMsg');
        
        try {
            // Parse the input as JavaScript array
            const data = eval(input);
            
            if (!Array.isArray(data) || !data.every(row => Array.isArray(row))) {
                throw new Error('Данные должны быть в формате двумерного массива');
            }
            
            this.carData = data;
            this.redraw();
            
            statusMsg.textContent = 'Данные успешно применены!';
            statusMsg.className = 'status success';
            
        } catch (error) {
            statusMsg.textContent = 'Ошибка: ' + error.message;
            statusMsg.className = 'status error';
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ParkingConstructor();
});

