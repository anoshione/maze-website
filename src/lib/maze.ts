/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Cell = {
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
};

export function generateMaze(width: number, height: number): Cell[][] {
  const grid: Cell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < width; x++) {
      row.push({ walls: { top: true, right: true, bottom: true, left: true }, visited: false });
    }
    grid.push(row);
  }

  const active: {x: number, y: number}[] = [{x: 0, y: 0}];
  grid[0][0].visited = true;

  while (active.length > 0) {
    const index = Math.random() < 0.7 ? active.length - 1 : Math.floor(Math.random() * active.length);
    const {x, y} = active[index];
    const neighbors = [];
    if (y > 0 && !grid[y - 1][x].visited) neighbors.push({x, y: y-1, dir: 'top'});
    if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push({x: x+1, y, dir: 'right'});
    if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push({x, y: y+1, dir: 'bottom'});
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push({x: x-1, y, dir: 'left'});

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      const cell = grid[y][x];
      const nextCell = grid[next.y][next.x];
      if (next.dir === 'top') { cell.walls.top = false; nextCell.walls.bottom = false; }
      if (next.dir === 'right') { cell.walls.right = false; nextCell.walls.left = false; }
      if (next.dir === 'bottom') { cell.walls.bottom = false; nextCell.walls.top = false; }
      if (next.dir === 'left') { cell.walls.left = false; nextCell.walls.right = false; }
      nextCell.visited = true;
      active.push({x: next.x, y: next.y});
    } else {
      active.splice(index, 1);
    }
  }
  return grid;
}
