// Draw the twisted vine path dynamically based on module positions
function drawVine() {
    const cards = document.querySelectorAll('.module-card');
    const svg = document.getElementById('vineSvg');
    const path = document.getElementById('vinePath');
    const container = document.getElementById('timelineContainer');
    
    if (cards.length === 0) return;

    const containerRect = container.getBoundingClientRect();
    svg.style.height = container.offsetHeight + 'px';
    
    // Start the trunk at the left edge of the timeline container
    const baseX = 0;
    
    const points = [];
    cards.forEach((card, i) => {
        const circle = card.querySelector('[class*="rounded-full"]');
        if (!circle) return;
        
        const rect = circle.getBoundingClientRect();
        const containerTop = container.getBoundingClientRect().top;
        
        // Use fixed X position for trunk, only Y varies
        const y = rect.top - containerTop + rect.height / 2;
        points.push({x: baseX, y: y});
    });

    if (points.length < 2) return;

    // Create flowing path with gentle waves, minimal loops
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        
        const dy = next.y - current.y;
        
        // Gentle wave motion
        const waveOffset = 12 + Math.sin(i * 0.7) * 8;
        const waveSide = (i % 2 === 0 ? 1 : -1);
        
        // Control point for gentle S-curve
        const midY = (current.y + next.y) / 2;
        const cpx = baseX + waveSide * waveOffset;
        
        // Use quadratic curve for smooth transition
        d += ` Q ${cpx} ${midY}, ${next.x} ${next.y}`;
    }
    
    path.setAttribute('d', d);
    path.setAttribute('stroke-width', '4');
    path.setAttribute('opacity', '0.65');
    
    // Add small branches along the path
    addSmallBranches();
}

function addSmallBranches() {
    const path = document.getElementById('vinePath');
    const branchesContainer = document.getElementById('branchesContainer');
    const leavesContainer = document.getElementById('leavesContainer');
    const pathLength = path.getTotalLength();
    
    // Clear existing branches
    branchesContainer.innerHTML = '';
    // Clear existing leaves to avoid accumulation on redraw
    if (leavesContainer) {
        leavesContainer.innerHTML = '';
    }
    
    // Array to store branch info for adding leaves
    const allBranches = [];
    
    // Number of small branches
    const numBranches = 20;
    
    for (let i = 0; i < numBranches; i++) {
        // Random position along the path
        const position = Math.random() * (pathLength - 50) + 25;
        const startPoint = path.getPointAtLength(position);
        
        // Get tangent for branch direction
        const nextPoint = path.getPointAtLength(position + 5);
        const tangentAngle = Math.atan2(nextPoint.y - startPoint.y, nextPoint.x - startPoint.x);
        
        // Bias branches to the right, but allow some to go left
        const biasRight = Math.random() < 0.75;
        const angleOffset = biasRight
            ? (-Math.PI / 3 + Math.random() * (Math.PI / 3))   // -60° to 0° -> mostly right
            : (Math.PI / 6 + Math.random() * (Math.PI / 3));   // +30° to +90° -> some left
        const branchAngle = tangentAngle + angleOffset;
        
        // Longer branches
        const branchLength = 80 + Math.random() * 120;
        
        // Create smooth curves with loops - use multiple control points
        const midProgress = 0.5;
        const loopIntensity = 0.3 + Math.random() * 0.4;
        
        // Calculate points for smooth S-curve with loop
        const cp1x = startPoint.x + Math.cos(branchAngle) * branchLength * 0.3;
        const cp1y = startPoint.y + Math.sin(branchAngle) * branchLength * 0.3 + (Math.random() - 0.5) * 30;
        
        const midX = startPoint.x + Math.cos(branchAngle) * branchLength * midProgress;
        const midY = startPoint.y + Math.sin(branchAngle) * branchLength * midProgress;
        
        // Add loop by offsetting perpendicular
        const perpAngle = branchAngle + Math.PI / 2;
        const loopOffset = loopIntensity * branchLength * 0.4;
        const loopX = midX + Math.cos(perpAngle) * loopOffset;
        const loopY = midY + Math.sin(perpAngle) * loopOffset;
        
        const cp2x = startPoint.x + Math.cos(branchAngle) * branchLength * 0.7;
        const cp2y = startPoint.y + Math.sin(branchAngle) * branchLength * 0.7 - (Math.random() - 0.5) * 30;
        
        const endX = startPoint.x + Math.cos(branchAngle) * branchLength;
        const endY = startPoint.y + Math.sin(branchAngle) * branchLength;
        
        // Create secondary branch path with smooth curves
        const branch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        branch.setAttribute('d', `M ${startPoint.x} ${startPoint.y} Q ${cp1x} ${cp1y}, ${loopX} ${loopY} T ${endX} ${endY}`);
        branch.setAttribute('class', 'vine-branch');
        branch.setAttribute('stroke-width', '2.5');
        branch.setAttribute('opacity', '0.75');
        
        branchesContainer.appendChild(branch);
        
        // Store branch info for leaves
        allBranches.push({ path: branch, weight: 0.6 });
        
        // Add fewer tertiary branches, also curved
        const numTertiaryBranches = 1 + Math.floor(Math.random() * 2);
        for (let j = 0; j < numTertiaryBranches; j++) {
            const t = 0.4 + Math.random() * 0.4;
            
            // Approximate point on curve using quadratic bezier formula
            const tertiaryStartX = (1-t)*(1-t)*startPoint.x + 2*(1-t)*t*cp1x + t*t*loopX;
            const tertiaryStartY = (1-t)*(1-t)*startPoint.y + 2*(1-t)*t*cp1y + t*t*loopY;
            
            // Tangent direction
            const tangentX = 2*(1-t)*(cp1x - startPoint.x) + 2*t*(loopX - cp1x);
            const tangentY = 2*(1-t)*(cp1y - startPoint.y) + 2*t*(loopY - cp1y);
            const tertiaryBaseAngle = Math.atan2(tangentY, tangentX);
            
            const tertiarySide = Math.random() > 0.5 ? 1 : -1;
            const tertiaryAngle = tertiaryBaseAngle + (Math.PI / 5 + Math.random() * Math.PI / 8) * tertiarySide;
            
            const tertiaryLength = 25 + Math.random() * 40;
            
            // Create smooth curve for tertiary branch
            const tCp1x = tertiaryStartX + Math.cos(tertiaryAngle) * tertiaryLength * 0.4;
            const tCp1y = tertiaryStartY + Math.sin(tertiaryAngle) * tertiaryLength * 0.4;
            
            const tertiaryEndX = tertiaryStartX + Math.cos(tertiaryAngle) * tertiaryLength;
            const tertiaryEndY = tertiaryStartY + Math.sin(tertiaryAngle) * tertiaryLength;
            
            const tertiaryBranch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            tertiaryBranch.setAttribute('d', `M ${tertiaryStartX} ${tertiaryStartY} Q ${tCp1x} ${tCp1y}, ${tertiaryEndX} ${tertiaryEndY}`);
            tertiaryBranch.setAttribute('class', 'vine-branch');
            tertiaryBranch.setAttribute('stroke-width', '1.2');
            tertiaryBranch.setAttribute('opacity', '0.65');
            
            branchesContainer.appendChild(tertiaryBranch);
            
            allBranches.push({ path: tertiaryBranch, weight: 0.3 });
        }
    }
    
    // Add leaves to all branches
    addLeavesAlongBranches(allBranches);
}

function addLeavesAlongBranches(branches) {
    const leavesContainer = document.getElementById('leavesContainer');
    const leafColors = ['#7fb069', '#88a580', '#6b8e6b', '#8b9d83', '#759e75', '#6d8b6d', '#9db19d'];
    
    // Add leaves to each branch
    branches.forEach(branchInfo => {
        const { path, weight } = branchInfo;
        const pathLength = path.getTotalLength();
        
        // Number of leaves proportional to branch size
        const numLeaves = Math.max(3, Math.floor(weight * 15));
        
        for (let i = 0; i < numLeaves; i++) {
            // Position leaves at intervals, with some randomness
            const position = (pathLength / numLeaves) * i + Math.random() * 20;
            const point = path.getPointAtLength(Math.min(position, pathLength - 5));
            
            // Get tangent angle for leaf orientation
            const nextPoint = path.getPointAtLength(Math.min(position + 3, pathLength));
            const tangentAngle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
            
            // Leaves grow perpendicular to the branch, alternating sides
            const side = (i % 2 === 0 ? 1 : -1);
            const perpendicularAngle = tangentAngle + (Math.PI / 2) * side;
            
            // Add random rotation to each leaf (10 to 45 degrees)
            const randomRotation = (10 + Math.random() * 35) * side;
            const leafAngle = perpendicularAngle * (180 / Math.PI) + randomRotation;
            
            // No offset - leaves start from the branch
            const leafX = point.x;
            const leafY = point.y;
            
            // Create leaf
            const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            leaf.setAttribute('class', 'vine-leaf-svg');
            leaf.setAttribute('transform', `translate(${leafX}, ${leafY}) rotate(${leafAngle})`);
            leaf.setAttribute('opacity', '0.8');
            
            // Leaf path (simplified leaf shape)
            const leafPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const size = 8 + Math.random() * 5;
            leafPath.setAttribute('d', `M 0,0 Q ${size*0.4},${-size*0.6} 0,${-size} Q ${-size*0.4},${-size*0.6} 0,0`);
            leafPath.setAttribute('fill', leafColors[i % leafColors.length]);
            leafPath.setAttribute('stroke', '#2d5016');
            leafPath.setAttribute('stroke-width', '0.5');
            leafPath.setAttribute('opacity', '0.85');
            
            leaf.appendChild(leafPath);
            leavesContainer.appendChild(leaf);
        }
    });
}

// Initialize vine on load
function initializeVine() {
    setTimeout(() => {
        drawVine();
    }, 100);
    window.addEventListener('resize', drawVine);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVine);
} else {
    initializeVine();
}
