/*
 * Copyright (c) 2026 Loop Andacat
 * SPDX-License-Identifier: 0BSD
 *
 * Free to use, copy, modify and distribute for any purpose,
 * including commercial use. No attribution required.
 *
 * This software is provided "AS IS", without warranty of
 * any kind. The author accepts no liability arising from
 * its use.
 *
 * Please use it responsibly and don't be naughty!
 *
 * See LICENSE for the full licence text.
 *
*/

// track.js

let characters_x = [];
let characters_y = [];
let characters_z = [];
let characters_texture = [];


// x, z, speed, direction
let other_car_positions = [
  [  50, 180, 7,  "east", -45],
  [ 150, 180, 8,  "east", -45],
  [ 250, 180, 6,  "east",  -0],
  [ 400, 180, 8,  "east",   0],
  [ 600, 180, 8,  "east",   0],
  [ 700, 220, 10, "east", -45]
];

const trackMap = [
  "┌>>>>>>>>>>>>>>┐",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............└>┐",
  "^................|",
  "^..............┌<┘",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............└>┐",
  "^................|",
  "^..............┌<┘",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............└>┐",
  "^................|",
  "^..............┌<┘",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............|",
  "^..............└>┐",
  "^................|",
  "^..............┌<┘",
  "^..............|",
  "^..............|",
  "└<<<<<<<<<<<<<<┘"
];

let trackVerticesBuffer;
let trackVerticesTextureCoordBuffer;
let trackVerticesIndexBuffer;
let trackVertexIndexCount = 0;
let trackBuildingVerticesBuffer;
let trackBuildingVerticesTextureCoordBuffer;
let trackBuildingVerticesIndexBuffer;
let trackBuildingVertexIndexCount = 0;
let slot_speed = 0;
let slot_lane_offset = -75;
let total_track_distance = 2000;
let target_slot_lane_offset = -75;

const LEFT_LANE_OFFSET = -75;
const RIGHT_LANE_OFFSET = 75;
const LANE_CHANGE_SPEED = 2.5;
const SLOT_ACCELERATION = 0.0285;
const SLOT_DECELERATION = 0.06;
const SLOT_MAX_SPEED = 8.0;
const CORNER_MAX_SPEED = 8.0;
const TILE_COUNT = 6;
const TILE_WIDTH = 1.0 / TILE_COUNT;

function UpdateLaneChange() {

    if (slot_lane_offset < target_slot_lane_offset) {
        slot_lane_offset += LANE_CHANGE_SPEED;

        if (slot_lane_offset > target_slot_lane_offset) {
            slot_lane_offset = target_slot_lane_offset;
        }
    }

    if (slot_lane_offset > target_slot_lane_offset) {
        slot_lane_offset -= LANE_CHANGE_SPEED;

        if (slot_lane_offset < target_slot_lane_offset) {
            slot_lane_offset = target_slot_lane_offset;
        }
    }
}

function createTrackFromText(trackMap, tileSize = 100) {
    const pieces = [];

    const definitions = {
        ">": { type: "straight", direction: "east",  textureTile: 1 },
        "<": { type: "straight", direction: "west",  textureTile: 1 },

        "^": { type: "straight", direction: "north", textureTile: 3 },
        "|": { type: "straight", direction: "south", textureTile: 3 },

        "┌": { type: "corner", from: "west", to: "north",  textureTile: 4 },
        "┐": { type: "corner", from: "east", to: "north",  textureTile: 5 },
        "└": { type: "corner", from: "south", to: "east",  textureTile: 0 },
        "┘": { type: "corner", from: "east",  to: "south", textureTile: 2 }
    };

    for (let row = 0; row < trackMap.length; row++) {
        for (let col = 0; col < trackMap[row].length; col++) {
            const char = trackMap[row][col];

            if (char === ".") continue;

            const def = definitions[char];

            if (!def) {
                throw new Error("Unknown track character " + char + " at row " + row + ", col " + col);
            }

            pieces.push({
                id: row + "_" + col,
                char: char,

                gridX: col,
                gridZ: row,

                x: col * tileSize,
                y: 0,
                z: row * tileSize,

                width: tileSize,
                length: tileSize,

                type: def.type,
                direction: def.direction,
                from: def.from,
                to: def.to,
                textureTile: def.textureTile
            });
        }
    }

    return pieces;
}


function pushWall(v, x1, z1, x2, z2, y, h) {
    v.push(
        x1, y + h+0, z1,
        x2, y + h+0, z2,
        x2, y + h+40,     z2,
        x1, y + h+40,     z1
    );
}

function getTrackUV(tileIndex) {
    const u0 = tileIndex * TILE_WIDTH;
    const u1 = u0 + TILE_WIDTH;

    // V flipped for WebGL texture loading
    return [
        u0, 1,
        u1, 1,
        u1, 0,
        u0, 0
    ];
}

function PlaceSpectator(x,y,z,track_piece) { // },x_min,x_max,z_min,z_max) {

    let how_many = Math.floor(Math.random() * 20) + 1;
    
    for (let rand = 1; rand < how_many; rand++) {
        let texture_random = Math.floor(Math.random() * 3) + 1;
        let side_of_track = Math.floor(Math.random() * 2) + 1;
        let x_placement = x; // x + Math.floor(Math.random() * 600) + 1;
        let z_placement = z; // + Math.floor(Math.random() * 600) + 1;
        
        if (track_piece == 0) {
            if (side_of_track == 1) {
                x_placement = x + Math.floor(Math.random() * 100) + 1;
                z_placement = z + Math.floor(Math.random() * 600) + 1;
            }
            else {
                x_placement = x + 400 + Math.floor(Math.random() * 100) + 1;
                z_placement = z + Math.floor(Math.random() * 600) + 1;
            }
        }

        if (track_piece == 1) { // start straight - working
            if (side_of_track == 1) {
                x_placement = x + Math.floor(Math.random() * 600) + 1;
                z_placement = z + Math.floor(Math.random() * 100) + 1;
            }
            else {
                x_placement = x + Math.floor(Math.random() * 600) + 1;
                z_placement = z + 400 + Math.floor(Math.random() * 100) + 1;
            }

            characters_x.push(x_placement);
            characters_y.push(y);
            characters_z.push(z_placement);
            characters_texture.push(texture_random);
        }

        if (track_piece == 3) { // back straight working
            if (side_of_track == 1) {
                x_placement = x + Math.floor(Math.random() * 100) + 1;
                z_placement = z + Math.floor(Math.random() * 600) + 1;
            }
            else {
                x_placement = x + 400 + Math.floor(Math.random() * 100) + 1;
                z_placement = z + Math.floor(Math.random() * 600) + 1;
            }

            characters_x.push(x_placement);
            characters_y.push(y);
            characters_z.push(z_placement);
            characters_texture.push(texture_random);
        }

    }
}

function createTrackGeometry(trackPieces) {
    let vertices = [];
    let textureCoordinates = [];
    let indices = [];
    let building_vertices = [];
    let building_textureCoordinates = [];
    let building_indices = [];

    for (let i = 0; i < trackPieces.length; i++) {
        let piece = trackPieces[i];

        let x = piece.x;
        let y = piece.y;
        let z = piece.z;

        let w = piece.width;
        let l = piece.length;
        let h = 0;

        let baseIndex = vertices.length / 3;
        let baseBuildingIndex = building_vertices.length / 3;

        vertices.push(
            x,     y, z,
            x + w, y, z,
            x + w, y, z + l,
            x,     y, z + l
        );

        const uv = getTrackUV(piece.textureTile);

        textureCoordinates.push(
            uv[0], uv[1],
            uv[2], uv[3],
            uv[4], uv[5],
            uv[6], uv[7]
        );

        indices.push(
            baseIndex, baseIndex + 1, baseIndex + 2,
            baseIndex, baseIndex + 2, baseIndex + 3
        );

        if (piece.textureTile === 1) {
            pushWall(building_vertices, x,     z,     x + w, z,     y, h);
            pushWall(building_vertices, x + w, z + l, x,     z + l, y, h);
            PlaceSpectator(x,y,z,1); //x-500,x+500,z-500,z+500);
        }
        else if (piece.textureTile === 3) {
            pushWall(building_vertices, x,     z + l, x,     z,     y, h);
            pushWall(building_vertices, x + w, z,     x + w, z + l, y, h);
            PlaceSpectator(x,y,z,3); //x-500,x+500,z-500,z+500);
        }
        else if (piece.textureTile === 0) {
            pushWall(building_vertices, x,     z + l, x + w, z + l, y, h);
            pushWall(building_vertices, x,     z,     x,     z + l, y, h);
            PlaceSpectator(x,y,z,0); //x-500,x+500,z-500,z+500);
        }
        else if (piece.textureTile === 2) {
            pushWall(building_vertices, x,     z + l, x + w, z + l, y, h);
            pushWall(building_vertices, x + w, z + l, x + w, z,     y, h);
            PlaceSpectator(x,y,z,2); //,x-500,x+500,z-500,z+500);
        }
        else if (piece.textureTile === 4) {
            pushWall(building_vertices, x + w, z,     x,     z,     y, h);
            pushWall(building_vertices, x,     z,     x,     z + l, y, h);
            PlaceSpectator(x,y,z,4); // ,x-500,x+500,z-500,z+500);
        }
        else if (piece.textureTile === 5) {
            pushWall(building_vertices, x,     z,     x + w, z,     y, h);
            pushWall(building_vertices, x + w, z,     x + w, z + l, y, h);
            PlaceSpectator(x,y,z,5); // ,x-500,x+500,z-500,z+500);
        }

        const wall1_uv = getWallUV(0);
        const wall2_uv = getWallUV(1);

        building_textureCoordinates.push(
            wall1_uv[0], wall1_uv[1],
            wall1_uv[2], wall1_uv[3],
            wall1_uv[4], wall1_uv[5],
            wall1_uv[6], wall1_uv[7],

            wall2_uv[0], wall2_uv[1],
            wall2_uv[2], wall2_uv[3],
            wall2_uv[4], wall2_uv[5],
            wall2_uv[6], wall2_uv[7]
        );

        building_indices.push(
            baseBuildingIndex, baseBuildingIndex + 1, baseBuildingIndex + 2,
            baseBuildingIndex, baseBuildingIndex + 2, baseBuildingIndex + 3,

            baseBuildingIndex + 4, baseBuildingIndex + 5, baseBuildingIndex + 6,
            baseBuildingIndex + 4, baseBuildingIndex + 6, baseBuildingIndex + 7,
        );
    }

    return {
        vertices: vertices,
        textureCoordinates: textureCoordinates,
        indices: indices,
        building_vertices: building_vertices,
        building_textureCoordinates: building_textureCoordinates,
        building_indices: building_indices
    };
}

const trackPieces = createTrackFromText(trackMap, 512);
const trackGeometry = createTrackGeometry(trackPieces);

const TILE_SIZE = 512;

function getTrackCharAtWorldPosition(x, z) {

    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(z / TILE_SIZE);

    if (row < 0 || row >= trackMap.length) return ".";
    if (col < 0 || col >= trackMap[row].length) return ".";

    return trackMap[row][col];
}

function getWallUV(imageIndex) {
    const imageWidth = 1.0 / 3.0;

    const u0 = imageIndex * imageWidth;
    const u1 = u0 + imageWidth;

    return [
        u0, 1,
        u1, 1,
        u1, 0,
        u0, 0
    ];
}
