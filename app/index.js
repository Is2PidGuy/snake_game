import React from 'react';
import {
    select,
} from 'd3';

// create N points such that adjacent nodes are L distance apart
const createPoints = (N, L) => {
    let x = 100;
    let y = 0;
    const points = [];
    for (let i = 0; i < N; i += 1) {
        points.push({ x, y });
        y += L;
    }
    return points;
};

const satisfyLinkConstraints = (points, L) => {
    // head is unchanged
    const newPoints = [points[0]];
    for (let i = 1; i < points.length; i += 1) {
        // satisfy distance constraint here
        const a = newPoints[i - 1];
        const b = points[i];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        const vba = { x: dx / distance, y: dy / distance };
        const x = a.x - L * vba.x;
        const y = a.y - L * vba.y;
        newPoints.push({ x, y });
    }
    return newPoints;
};

class Main extends React.Component {
    componentDidMount() {
        this.N = 280;
        this.L = 2;
        this.points = createPoints(this.N, this.L);
        this.draw();
        this.headAngle = -Math.PI / 2;
        document.addEventListener('mousedown', (e) => {
            this.down = true;
            this.updateHead(e.clientX, e.clientY);
        });
        document.addEventListener('mousemove', (e) => {
            if (!this.down) return;
            this.updateHead(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', (e) => {
            this.down = false;
        });
        setInterval(
            () => {
                this.moveUp();
            }
            , 10
        );
        document.addEventListener('keydown', (e) => {
            const k = e.key;
            if (k === 'ArrowLeft') {
                this.headAngle -= 0.1;
            }
            if (k === 'ArrowRight') {
                this.headAngle += 0.1;
            }
        });
    }

    moveUp() {
        const [head, ...tail] = this.points;
        const del = 2;
        const x = head.x + del * Math.cos(this.headAngle);
        const y = head.y + del * Math.sin(this.headAngle);
        this.updateHead(x, y);
    }

    updateHead(x, y) {
        const [, ...tail] = this.points;
        this.points = [{ x, y }, ...tail];
        this.points = satisfyLinkConstraints(this.points, this.L);
        this.draw();
    }

    draw() {
        const node = select(this.node);
        node.style('position', 'relative');
        const updateSel = node.selectAll('div').data(this.points);
        const headWidth = 30;
        const tailWidth = 10;
        const width = (index) => 
            headWidth + (tailWidth - headWidth) * (index / (this.N - 1));
        updateSel.enter()
            .append('div')
            .style('position', 'absolute')
            .style('background', 'red')
            .style('border-radius', '50%')
            .style('width', (d, i) => `${width(i)}px`)
            .style('height', (d, i) => `${width(i)}px`)
            .merge(updateSel)
            .style('left', d => `${d.x}px`)
            .style('top', d => `${d.y}px`)
            ;
    }

    render() {
        return (
            <div ref={(node) => this.node = node}>
            </div>
        );
    }
}

export default Main;

