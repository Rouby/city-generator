import React, { Component } from 'react';
import './App.css';

const v = require('voronoi');
const sizeFunc = (x) =>
    1500 + (50 - 1500) / (1 + Math.pow(x / 10, 1.23));

const randomPoI = (val) =>
    [
        [1, 'Tavern'],
        [2, 'Market'],
        [3, 'Guardhouse'],
        [4, 'Shrine'],
        [5, 'Master Artisan'],
        [6, 'Inn'],
        [7, 'Manor'],
        [8, 'Guildhall'],
        [9, 'Temple'],
        [10, 'Barracks'],
        [11, 'Warehouse'],
        [12, 'Keep'],
        [13, 'Library'],
        [14, 'Courthouse'],
        [15, 'College'],
        [16, 'Gaol'],
        [17, 'Mausoleum'],
        [18, 'Necropolis'],
        [19, 'Wizard’s Tower'],
        [20, 'Castle']
    ].find(([v, poi]) => val === v)[1];

const wealthCategories = [
    [12, 'squalid'],
    [17, 'poor'],
    [22, 'modest'],
    [27, 'comfortable'],
    [32, 'wealthy'],
    [Number.MAX_SAFE_INTEGER, 'aristocratic']
];

const numToWealth = (val) =>
{
    const idx = wealthCategories.findIndex(([v, wealth]) => v > val);
    return [idx, wealthCategories[idx][1]];
};

class App extends Component
{
    render()
    {
        const voronoi = new v();
        const dieConfig = {
            d4: 8,
            d6: 4,
            d8: 3,
            d10: 2,
            d12: 1,
            d20: 1
        };
        const dice = Object.getOwnPropertyNames(dieConfig).map(key => Array.apply(null, { length: dieConfig[key] }).map(_ => ({ d: +key.substr(1) }))).reduce((acc, cur) => [...acc, ...cur]);
        const width = sizeFunc(dice.length), height = sizeFunc(dice.length), margin = 100;
        const pointsOfInterest = dice.map(opt => ({
            die: opt.d,
            roll: 1 + Math.floor(Math.random() * opt.d),
            x: Math.random() * width,
            y: Math.random() * height
        })).map(({ die, roll, x, y }) => ({
            die, roll, x, y,
            poi: randomPoI(roll)
        }));
        const fringePoints = [
            { x: -margin, y: -margin },
            { x: width / 2, y: -margin },
            { x: width + margin, y: -margin },
            { x: width + margin, y: height / 2 },
            { x: width + margin, y: height + margin },
            { x: width / 2, y: height + margin },
            { x: -margin, y: height + margin },
            { x: -margin, y: height / 2 }
        ];
        const diagram = voronoi.compute(pointsOfInterest.concat(fringePoints), { xl: -margin, xr: width + margin, yt: -margin, yb: height + margin });
        const neighbourhoods = diagram.cells.filter(cell => 'die' in cell.site).map((cell, idx) =>
        {
            const sites = cell.halfedges.map(e => e.edge).map(e => e.lSite === cell.site ? e.rSite : e.lSite).filter(s => !!s).concat([cell.site]);
            // const percent = sites.map(s => s.roll / s.die || 0).reduce((acc, cur) => acc + cur) / sites.length;
            const [wealth, lifestyle] = numToWealth(sites.map(s => s.roll || 0).reduce((acc, cur) => acc + cur, 0));
            const vertices = cell.halfedges.map(e => [e.getStartpoint(), e.getEndpoint()]).reduce((acc, cur) => [...acc, ...cur], []);
            return (
                <g key={idx}>
                    <path key={idx} d={`M${vertices.map(v => `${v.x},${v.y}`).join(' L')}`} style={{ fill: `hsl(${120 * wealth / 5}, 70%, 50%)` }}></path>
                    <circle cx={cell.site.x} cy={cell.site.y} r={2 + cell.site.roll}></circle>
                    <text transform={`translate(${cell.site.x}, ${cell.site.y - 10})`} dominantBaseline="middle" textAnchor="middle">
                        <tspan x="0">{cell.site.poi}</tspan>
                        <tspan x="0" dy="1.1em">{lifestyle}</tspan>
                    </text>
                </g>
            );
        });
        return (
            <div className="App">
                <svg width="800" height="800" viewBox={`${-margin} ${-margin} ${width + 2 * margin} ${height + 2 * margin}`}>
                    <g>
                        {neighbourhoods}
                    </g>
                </svg>
            </div>
        );
    }
}

export default App;
