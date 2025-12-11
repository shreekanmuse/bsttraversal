class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

let currentRoot;
let correctAnswer = '';
const nodeRadius = 20;


const traversalTypes = [
    { name: 'Pre-order', func: getPreOrder },
    { name: 'In-order', func: getInOrder },
    { name: 'Post-order', func: getPostOrder }
];
let currentGoal = {};

function getPreOrder(node, result = []) {
    if (node) {
        result.push(node.data);       
        getPreOrder(node.left, result);  
        getPreOrder(node.right, result); 
    }
    return result.join(','); 
}


function getInOrder(node, result = []) {
    if (node) {
        getInOrder(node.left, result);  
        result.push(node.data);         
        getInOrder(node.right, result); 
    }
    return result.join(','); 
}

function getPostOrder(node, result = []) {
    if (node) {
        getPostOrder(node.left, result);  
        getPostOrder(node.right, result); 
        result.push(node.data);         
    }
    return result.join(','); 
}

function generateTree(dataArray) {
    if (dataArray.length < 7) return null;

    let nodes = dataArray.map(data => new Node(data));
    nodes[0].left = nodes[1]; nodes[0].right = nodes[2];
    nodes[1].left = nodes[3]; nodes[1].right = nodes[4];
    nodes[2].left = nodes[5]; nodes[2].right = nodes[6];
    
    return nodes[0];
}

const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

function layoutTree(node, x, y, xOffset) {
    if (!node) return;
    node.x = x;
    node.y = y;
    layoutTree(node.left, x - xOffset, y + 80, xOffset / 2);
    layoutTree(node.right, x + xOffset, y + 80, xOffset / 2);
}

function drawTree(node) {
    if (!node) return;

    ctx.strokeStyle = '#36454F';
    ctx.lineWidth = 2;
    if (node.left) { ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(node.left.x, node.left.y); ctx.stroke(); }
    if (node.right) { ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(node.right.x, node.right.y); ctx.stroke(); }

    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcc00'; 
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.data, node.x, node.y);

    drawTree(node.left);
    drawTree(node.right);
}

function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    layoutTree(currentRoot, canvas.width / 2, 40, 200); 
    drawTree(currentRoot);
}


function initGame() {
    const initialNodes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    currentRoot = generateTree(initialNodes);
    
    const randomIndex = Math.floor(Math.random() * traversalTypes.length);
    currentGoal = traversalTypes[randomIndex];
    
    correctAnswer = currentGoal.func(currentRoot);
    console.log(`Current Goal (${currentGoal.name}):`, correctAnswer);
    
    document.getElementById('goal-display').textContent =`Goal: ${currentGoal.name} Traversal`;
    document.getElementById('feedback').textContent = '';
    document.getElementById('user-input').value = '';
    document.getElementById('next-tree-btn').style.display = 'none';

    renderGame();
}

const form = document.getElementById('traversal-form');
const inputField = document.getElementById('user-input');
const feedbackElement = document.getElementById('feedback');
const nextTreeButton = document.getElementById('next-tree-btn');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userInput = inputField.value.toUpperCase().replace(/\s/g, '');
    
    if (userInput === correctAnswer) {
        feedbackElement.textContent = ` CORRECT! The sequence IS : ${correctAnswer}`;
        feedbackElement.className = 'message correct';
        nextTreeButton.style.display = 'block';
    } else {
        feedbackElement.textContent = ' INCORRECT. Try again!';
        feedbackElement.className = 'message incorrect';
    }
});

nextTreeButton.addEventListener('click', function() {
    initGame(); 
});


initGame();