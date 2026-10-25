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

// Section 1: Define Game Variables
let canvas;
let gl;
let movementMatrix = [];
let matrixStack = [];
let shaderProgram;
let vertexPositionAttribute;
let textureCoordAttribute;
let phase_of_game = "game";
let score = 0;
let level = 0;
let character_image = ["images/persona.png","images/personb.png", "images/personc.png", "images/persond.png"];
let cube_texture_image = "images/trees_track.png";
let building_image = ["images/trees_track.png","images/building2.png","images/building3.png","images/building4.png"]
let car_image = ["images/redcar.png","images/yellowcar.png","images/greencar.png","images/bluecar.png"];
let floor_texture_image = "images/trackpieces.png";
let sea_texture_image = "images/sea.png";
let sky_texture_image = "images/sky.png";
let bonnet_texture_image = "images/car_bonnet.png";
let laps = -1;
let too_fast = false;
let lap_time = 0;
let best_lap_time = 1000;
let off_track = false;
let crashed = false;
let race_started = false;

let characters_health = [
3,3,3,3,5,5,1,1,
3,3,3,3,5,5,1,1,
3,3,3,3,5,5,1,1,
3,3,3,3,5,5,1,1,
3,3,3,3,5,5,1,1,
3,3,3,3,5,5,1,1,
3,3,3,3,5,5,1,1,
3,3,3,3,5,5,1,1,
];

let characters_direction = [
270,270,270,270,270,270,270,270,
270,270,270,270,270,270,270,270,
270,270,270,270,270,270,270,270,
180,180,180,180,180,180,180,180,
270,270,270,270,270,270,270,270,
90,90,90,90,90,90,90,90,
90,90,90,90,90,90,90,90,
70,70,70,70,70,70,70,70,
];

let x_location = 850;
let y_location = -30;
let z_location = 180
let camera_angle = 90;
let reversed_camera_angle = 270;
let slot_direction = "east";
let floorVerticesBuffer;
let seaVerticesBuffer;
let skyVerticesBuffer;
let floorVerticesTextureCoordBuffer;
let floorVerticesIndexBuffer;
let spriteVerticesBuffer;
let carVerticesBuffer;
let spriteTallVerticesBuffer;
let spriteVerticesTextureCoordBuffer;
let otherCarVerticesTextureCoordBuffer;
let buildingVerticesTextureCoordBuffer;
let carVerticesTextureCoordBuffer;
let spriteVerticesIndexBuffer;
let buildingVerticesIndexBuffer;
let game_texture = [];
let game_image = [];
let floorImage;
let cubeImage;
let spriteImage = [];
let floorTexture;
let cubeTexture;
let spriteTexture = [];
let player_speed = 1.0;
let acceleration = 0;
let player_rotation_speed = 0.01;
let rotation_acceleration = 0;
let camera_rotation_direction = 1;
let y_camera_angle = 0;
let rotate_direction = 3;
let movement_direction = 0;
let level_just_loaded = true;
let frames = 0;
let fps = 0;
let characters_turn_timer = [];
let last_safe_x = x_location;
let last_safe_z = z_location;
let last_safe_direction = slot_direction;
let player_car_collision = false;

// Section 2: Define the simpler graphic models

let sprite_vertices = [
    // Front face
    -8, 0,  3,
     8, 0,  3,
     8,  50,  3,
    -8,  50,  3,
    // Back face
    -8, 0, -3,
    -8,  50, -3,
     8,  50, -3,
     8, -0, -3,
    // Right face
     8, 0, -3,
     8,  50, -3,
     8,  50,  3,
     8, 0,  3,
    // Left face
    -8, 0, -3,
    -8, 0,  3,
    -8,  50,  3,
    -8,  50, -3,
    // Top face
    -8, 50, -3,
    8, 50, -3,
    8, 50,  3,
    -8, 50,  3,
];

let building_vertices = [
    // Front face
    -40, 0,  20,
     40, 0,  20,
     40,  20,  20,
    -40,  20,  20,
    // Back face
    -40, 0, -20,
    -40,  20, -20,
     40,  20, -20,
     40, -0, -20,
    // Right face
     40, 0, -20,
     40,  20, -20,
     40,  20,  20,
     40, 0,  20,
    // Left face
    -40, 0, -20,
    -40, 0,  20,
    -40,  20,  20,
    -40,  20, -20,
    // Top face
    -40, 20, -20,
    40, 20, -20,
    40, 20,  20,
    -40, 20, 20,
];

let car_vertices = [
    // Front face
    -2, 0,  2,
     2, 0,  2,
     2,  4.5,  2,
    -2,  4.5,  2,
    // Back face
    -2, 0, -0.5,
    -2,  4.5, -0.5,
     2,  4.5, -0.5,
     2, -0, -0.5,
    // Right face
     2, 0, -2,
     2,  4.5, -2,
     2,  4.5,  2,
     2, 0,  2,
    // Left face
    -2, 0, -2,
    -2, 0,  2,
    -2,  4.5,  2,
    -2,  4.5, -2,
    // Top face
    -1.25, 3.5, -6,
    1.25, 3.5, -6,
    1.5, 4.5,  0,
    -1.5, 4.5,  0,
];

let sprite_texture_coordinates = [

    0.0,  1.0,
    0.5,  1.0,
    0.5,  0.0,
    0.0,  0.0,
    
    0.5,  1.0,
    0.5,  0.0,
    1.0,  0.0,
    1.0,  1.0,
	
    0.5,  1.0,
    0.5,  0.0,
    1.0,  0.0,
    1.0,  1.0,
	
    0.5,  1.0,
    1.0,  1.0,
    1.0,  0.0,
    0.5,  0.0,
	
    0.0,  0.0,
    0.1,  0.0,
    0.1,  0.1,
    0.0,  0.1,
 ];

 let building_texture_coordinates = [

    0.0,  1.0,
    1.0,  1.0,
    1.0,  0.0,
    0.0,  0.0,
    
    0.0,  1.0,
    1.0,  1.0,
    1.0,  0.0,
    0.0,  0.0,
	
    0.0,  1.0,
    1.0,  1.0,
    1.0,  0.0,
    0.0,  0.0,
	
    0.0,  1.0,
    1.0,  1.0,
    1.0,  0.0,
    0.0,  0.0,
	
    0.0,  1.0,
    1.0,  1.0,
    1.0,  0.0,
    0.0,  0.0,
 ];

 let other_car_texture_coordinates = [
  // front
  1.0, 1.0,
  1.0, 0.5,
  0.0, 0.5,
  0.0, 1.0,

  // back - flipped horizontally
 1.0, 1.0,
  1.0, 0.5,
  0.0, 0.5,
  0.0, 1.0,

  // right
  0.0, 0.5,
  0.0, 0.0,
  1.0, 0.0,
  1.0, 0.5,

  // back
  1.0, 0.5,
  0.0, 0.5,
  0.0, 0.0,
  1.0, 0.0,

  // top
  0.0, 0.5,
  1.0, 0.5,
  1.0, 0.0,
  0.0, 0.0,
];

 let car_texture_coordinates = [

    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
	
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
	
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
	
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
 ];
 
 let sprite_vertex_indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // right
    12, 13, 14,     12, 14, 15,   // left
    16, 17, 18,     16, 18, 19   // top
];


 let building_vertex_indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // right
    12, 13, 14,     12, 14, 15,   // left
    16, 17, 18,     16, 18, 19,   // top
];


let sea_vertices = [
    -1000,     -5, -22500,
    22500, -5, -22500,
    22500, -5, 30500,
    -1000,     -5,  30500,
];

	
let floor_vertex_indices = [
    0,  1,  2,      
    0,  2,  3, 
];
	

let floor_vertices = [
     -800, -10, -800,
    5000, -10, -800,
    5000, -10, 5000,
    -800, -10,  5000,
];

let floor_texture_coordinates = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
];

let sky_vertices = [
    -2000,     1000, -22500,
    22500, 1000, -22500,
    22500, 1000, 30500,
    -2000,     1000,  30500,
];

function StartRace() {

    race_started = false;
    slot_speed = 0;
    movement_direction = 0;

    document.getElementById("racemessage").style.visibility = "visible";
    document.getElementById("racemessagetitle").innerHTML = "GET READY";
    document.getElementById("racemessagesubtitle").innerHTML = "";

    setTimeout(function() {
    document.getElementById("racemessagetitle").innerHTML = "3";
}, 1000);

setTimeout(function() {
    document.getElementById("racemessagetitle").innerHTML = "2";
}, 2000);

setTimeout(function() {
    document.getElementById("racemessagetitle").innerHTML = "1";
}, 3000);

setTimeout(function() {
    document.getElementById("racemessagetitle").innerHTML = "GO!";
    race_started = true;
}, 4000);

setTimeout(function() {
    document.getElementById("racemessage").style.visibility = "hidden";
}, 5000);
}

// Section 3: Attach inputs such as keyboard ( add mouse, etc here )
window.addEventListener("keydown", checkKeyPressed, false);
window.addEventListener("keyup", checkKeyUnPressed, false);

// Touch screen controls
window.addEventListener("touchstart", function (event) {
    event.preventDefault();

    // same effect as holding the up arrow
    movement_direction = 1;
}, false);

window.addEventListener("touchend", function (event) {
    event.preventDefault();

    // same effect as releasing the up arrow
    movement_direction = 0;
}, false);

// Section 4: Initiate the game ( this start() function was called on the index.html page )

function start() {

  canvas = document.getElementById("glcanvas");
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;

  initWebGL(canvas);

  if (gl) {

    gl.clearColor(0.133, 0.529, 0.957, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    initShaders();
    initBuffers();
    initTextures();

    let perspectiveMatrix =
      createPerspective(45, canvas.width / canvas.height, 0.1, 2000.0);

    let pUniform =
      gl.getUniformLocation(shaderProgram, "uPMatrix");

    gl.uniformMatrix4fv(
      pUniform,
      false,
      new Float32Array(perspectiveMatrix)
    );

    setInterval(function() {
      GraphicsLoop();
      GameplayLoop();
    }, 1);

    setInterval(function() {
      FrameMonitor();
    }, 1000);
  }

  StartRace();
}

// Section 5: for every frame refresh run this ( if we can handle 60 FPS then that is how many times this is called per second )

function GraphicsLoop() {

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  loadIdentity();
  moveRotate(0, [1, 0, 0]);
  moveRotate(y_camera_angle, [1, 0, 0]);
  moveRotate(camera_angle, [0, 1, 0]);
  DisplayCar();
  moveTranslate([-x_location, y_location, -z_location]);
  DrawCharacters();
  DrawOtherCars();
  DisplayTrack();
  DisplayFloorSky();
  frames++;
}

function DisplayCar() {
  
  movePushMatrix();
  moveRotate(-camera_angle, [0, 1, 0]);
  moveTranslate([0, -5, 0]);
  gl.bindBuffer(gl.ARRAY_BUFFER, carVerticesTextureCoordBuffer);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, game_texture[8]);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, carVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, spriteVerticesIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0);
  movePopMatrix();
}

function FindNextTrackTile(car) {
    var x = car.mapX;
    var z = car.mapZ;
    var tile = car.tile;

    if (tile === ">") {
        car.dir = "right";
        return { x: x + 1, z: z };
    }

    if (tile === "<") {
        car.dir = "left";
        return { x: x - 1, z: z };
    }

    if (tile === "|") {
        car.dir = "down";
        return { x: x, z: z + 1 };
    }

    if (tile === "^") {
        car.dir = "up";
        return { x: x, z: z - 1 };
    }

    if (tile === "┌") {
        if (car.dir === "up") {
            car.dir = "right";
            return { x: x + 1, z: z };
        }
        if (car.dir === "left") {
            car.dir = "down";
            return { x: x, z: z + 1 };
        }
    }

    if (tile === "┐") {
        if (car.dir === "right") {
            car.dir = "down";
            return { x: x, z: z + 1 };
        }
        if (car.dir === "up") {
            car.dir = "left";
            return { x: x - 1, z: z };
        }
    }

    if (tile === "└") {
        if (car.dir === "left") {
            car.dir = "up";
            return { x: x, z: z - 1 };
        }
        if (car.dir === "down") {
            car.dir = "right";
            return { x: x + 1, z: z };
        }
    }

    if (tile === "┘") {
        if (car.dir === "right") {
            car.dir = "up";
            return { x: x, z: z - 1 };
        }
        if (car.dir === "down") {
            car.dir = "left";
            return { x: x - 1, z: z };
        }
    }

    return { x: x, z: z };
}

function FrameMonitor() {

  fps = frames;
  frames = 0;

  UpdateStats();

  if (fps < 50) {
    phase_of_game = "pause";
    document.getElementById("framerate").style.visibility = "visible";
  }
  else {
    if (phase_of_game == "pause") {
      phase_of_game = "game";
    }

    document.getElementById("framerate").style.visibility = "hidden";
  }
}


function CheckPlayerCarCollisions() {

    let collision_now = false;

    for (let i = 0; i < other_car_positions.length; i++) {

        let aiX = other_car_positions[i][0];
        let aiZ = other_car_positions[i][1];

        let dx = x_location - aiX;
        let dz = z_location - aiZ;

        let distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < 40) {

            collision_now = true;

            if (!player_car_collision) {
                slot_speed = slot_speed / 2;
            }

            break;
        }
    }

    player_car_collision = collision_now;
}

// Section 6: the game logic ( like moving characters around )
function GameplayLoop() {
  if (phase_of_game == "game") {
    ControlPlayerMovement();
    ControlOtherCars();
    CheckPlayerCarCollisions();
  }
}

// Section 7: player controls ( in this example we are just using keyboard controls )

function checkKeyUnPressed(e) {
    if (e.key === "ArrowUp") {
        movement_direction = 0;
    }
}

function checkKeyPressed(e) {

    if (e.key === "ArrowUp") {
        movement_direction = 1;
    }

    if (e.key === "ArrowLeft") {
        target_slot_lane_offset = LEFT_LANE_OFFSET;
    }

    if (e.key === "ArrowRight") {
        target_slot_lane_offset = RIGHT_LANE_OFFSET;
    }
}

let slot_lane = 0;
let slot_radius = TILE_SIZE / 2;

function getTrackInfoAtWorldPosition(worldX, worldZ) {
    if (!Number.isFinite(worldX) || !Number.isFinite(worldZ)) {
        return null;
    }

    const col = Math.floor(worldX / TILE_SIZE);
    const row = Math.floor(worldZ / TILE_SIZE);

    if (row < 0 || row >= trackMap.length) return null;
    if (col < 0 || col >= trackMap[row].length) return null;

    return {
        char: trackMap[row][col],
        row: row,
        col: col,
        tileX: col * TILE_SIZE,
        tileZ: row * TILE_SIZE
    };
}

function HasPassedStartLine(currentX, currentZ, newX, newZ) {

  if (currentZ > 0 && currentZ < 200 && currentX < 1800 && newX > 1800)
    return true; 

  return false;
}

function CollidedWithCar() {

    slot_speed /= 2;

    setTimeout(function() {

        x_location = last_safe_x;
        z_location = last_safe_z;
        slot_direction = last_safe_direction;

        slot_speed = 0;
        off_track = false;
        crashed = false;

        setCameraAngleFromSlotDirection(slot_direction);

    }, 1500);
}

function CrashPlayer() {

    crashed = true;
    slot_speed = 0;

    document.getElementById("crashmessage").style.visibility = "visible";

    setTimeout(function() {

        x_location = last_safe_x;
        z_location = last_safe_z;
        slot_direction = last_safe_direction;

        slot_speed = 0;
        off_track = false;
        crashed = false;

        setCameraAngleFromSlotDirection(slot_direction);

        document.getElementById("crashmessage").style.visibility = "hidden";

    }, 1500);
}

function ControlOtherCars() {

  if (!race_started) {
    return;
  }

  for (let i = 0; i < other_car_positions.length; i++) {
    let x = other_car_positions[i][0];
    let z = other_car_positions[i][1];
    let s = other_car_positions[i][2];
    let direction = other_car_positions[i][3];
    let laneOffset = other_car_positions[i][4];

    let info = getTrackInfoAtWorldPosition(x, z);

    if (!info || info.char === ".") {
      continue;
    }
    
    if (info.char === ">" || info.char === "<" || info.char === "^" || info.char === "|") {
      const result = moveCarAlongStraightSlot(info, s, x, z, direction, laneOffset);
      other_car_positions[i][0] = Math.trunc(result.new_x);
      other_car_positions[i][1] = Math.trunc(result.new_z);
      other_car_positions[i][3] = result.new_direction;
    }
    else {
      const result = moveCarAroundBendSlot(info, s, x, z, direction, laneOffset);
      other_car_positions[i][0] = Math.trunc(result.new_x);
      other_car_positions[i][1] = Math.trunc(result.new_z);
      other_car_positions[i][3] = result.new_direction;
    }
  }
}


function ControlPlayerMovement() {

  if (crashed) {
    return;
  }

  if (!race_started) {
    return;
  }

  if (movement_direction > 0) {
        slot_speed += SLOT_ACCELERATION;

        if (slot_speed > SLOT_MAX_SPEED) {
            slot_speed = SLOT_MAX_SPEED;
        }
  }
  else {
        slot_speed -= SLOT_DECELERATION;

        if (slot_speed < 0) {
            slot_speed = 0;
        }
  }

  UpdateLaneChange();

  let speed = slot_speed;

  if (off_track) {
        leaveTrackStraight(speed);
        return;
  }

    let worldX = x_location;
    let worldZ = z_location;

    let info = getTrackInfoAtWorldPosition(worldX, worldZ);

    if (!info || info.char === ".") {
        return;
    }

    if (
        info.char === ">" ||
        info.char === "<" ||
        info.char === "^" ||
        info.char === "|"
    ) {

      last_safe_x = x_location;
      last_safe_z = z_location;
      last_safe_direction = slot_direction;
        moveAlongStraightSlot(info, speed);
    }
    else {
        if (speed > CORNER_MAX_SPEED) {
            off_track = true;
            leaveTrackStraight(speed);
             CrashPlayer();
        }
        else {
            moveAroundBendSlot(info, speed);
        }
    }
}

function leaveTrackStraight(speed) {

    if (slot_direction === "east") {
        x_location += speed;
    }

    if (slot_direction === "west") {
        x_location -= speed;
    }

    if (slot_direction === "north") {
        z_location -= speed;
    }

    if (slot_direction === "south") {
        z_location += speed;
    }
}



function moveCarAlongStraightSlot(info, speed, x, z, direction, laneOffset) {

    let worldX = x;
    let worldZ = z;

    let centreX = info.tileX + TILE_SIZE / 2;
    let centreZ = info.tileZ + TILE_SIZE / 2;

    // we need a slot_direction for each car
    if (info.char === ">") {
        direction = "east";
        worldZ = centreZ + laneOffset;
        worldX += speed;
    }

    if (info.char === "<") {
        direction = "west";
        worldZ = centreZ - laneOffset;
        worldX -= speed;
    }

    if (info.char === "^") {
        direction = "north";
        worldX = centreX + laneOffset;
        worldZ -= speed;
    }

    if (info.char === "|") {
        direction = "south";
        worldX = centreX - laneOffset;
        worldZ += speed;
    }

    return {
      new_x: worldX,
      new_z: worldZ,
      new_direction: direction
    };

}

function moveCarAroundBendSlot(info, speed, x, z, direction, laneOffset) {

    let worldX = x;
    let worldZ = z;
    let cx;
    let cz;
    
    if (info.char === "┌") {
        cx = info.tileX + TILE_SIZE;
        cz = info.tileZ + TILE_SIZE;
    }

    if (info.char === "┐") {
        cx = info.tileX;
        cz = info.tileZ + TILE_SIZE;
    }

    if (info.char === "┘") {
        cx = info.tileX;
        cz = info.tileZ;
    }

    if (info.char === "└") {
        cx = info.tileX + TILE_SIZE;
        cz = info.tileZ;
    }

    let dx = worldX - cx;
    let dz = worldZ - cz;

    let angle = Math.atan2(dz, dx);

    let turnDirection = 1;

    // we need a slot_direction for each car
    if (info.char === "└" && direction === "south") {
        turnDirection = -1;
    }

    if (info.char === "┌" && direction === "west") {
        turnDirection = -1;
    }

    angle += turnDirection * speed / slot_radius;

    let laneRadius;

    if (turnDirection === 1) {
        laneRadius = slot_radius - laneOffset;
    }
    else {
        laneRadius = slot_radius + laneOffset;
    }

    worldX = cx + Math.cos(angle) * laneRadius;
    worldZ = cz + Math.sin(angle) * laneRadius;

    if (info.char === "┐" && direction === "east") {
    direction = "south";
    }

    if (info.char === "┘" && direction === "south") {
      direction = "west";
    }

    if (info.char === "└" && direction === "west") {
      direction = "north";
    }

    if (info.char === "┌" && direction === "north") {
      direction = "east";
    }

    return {
      new_x: worldX,
      new_z: worldZ,
      new_direction: direction
    };
}

function moveAlongStraightSlot(info, speed) {

    let worldX = x_location;
    let worldZ = z_location;

    let centreX = info.tileX + TILE_SIZE / 2;
    let centreZ = info.tileZ + TILE_SIZE / 2;

    if (info.char === ">") {

        slot_direction = "east";
        worldZ = centreZ + slot_lane_offset;

        if (HasPassedStartLine(worldX,worldZ,(worldX+speed),worldZ)) {
          laps++;
          if (lap_time < best_lap_time && laps >= 1 ) {
            best_lap_time = lap_time;
          }
          lap_time=0;
        }
        worldX += speed;
    }

    if (info.char === "<") {
        slot_direction = "west";
        worldZ = centreZ - slot_lane_offset;
        worldX -= speed;
    }

    if (info.char === "^") {
        slot_direction = "north";
        worldX = centreX + slot_lane_offset;
        worldZ -= speed;
    }

    if (info.char === "|") {
        slot_direction = "south";
        worldX = centreX - slot_lane_offset;
        worldZ += speed;
    }

    x_location = worldX;
    z_location = worldZ;

    setCameraAngleFromSlotDirection(slot_direction);

    document.getElementById('speedcontrol').style.visibility = 'hidden';
    if (speed > 0) {
      score++;
    }

    document.getElementById("speed").value = Math.trunc(speed*30) + " MPH";
}

function moveAroundBendSlot(info, speed) {

    document.getElementById("speed").value = Math.trunc(speed*30) + " MPH";

    let worldX = x_location;
    let worldZ = z_location;
    let cx;
    let cz;

    if (info.char === "┌") {
        cx = info.tileX + TILE_SIZE;
        cz = info.tileZ + TILE_SIZE;
    }

    if (info.char === "┐") {
        cx = info.tileX;
        cz = info.tileZ + TILE_SIZE;
    }

    if (info.char === "┘") {
        cx = info.tileX;
        cz = info.tileZ;
    }

    if (info.char === "└") {
        cx = info.tileX + TILE_SIZE;
        cz = info.tileZ;
    }

    let dx = worldX - cx;
    let dz = worldZ - cz;

    let angle = Math.atan2(dz, dx);

    let turnDirection = 1;

    if (info.char === "└" && slot_direction === "south") {
        turnDirection = -1;
    }

    if (info.char === "┌" && slot_direction === "west") {
        turnDirection = -1;
    }

    angle += turnDirection * speed / slot_radius;

    let laneRadius;

    if (turnDirection === 1) {
        laneRadius = slot_radius - slot_lane_offset;
    }
    else {
        laneRadius = slot_radius + slot_lane_offset;
    }

    worldX = cx + Math.cos(angle) * laneRadius;
    worldZ = cz + Math.sin(angle) * laneRadius;

    x_location = worldX;
    z_location = worldZ;

    let tangentX = -Math.sin(angle) * turnDirection;
    let tangentZ = Math.cos(angle) * turnDirection;

    setCameraAngleFromWorldVector(tangentX, tangentZ);
}

function setCameraAngleFromSlotDirection(direction) {

    if (direction === "east")  camera_angle = 90;
    if (direction === "west")  camera_angle = 270;
    if (direction === "north") camera_angle = 0;
    if (direction === "south") camera_angle = 180;

        reversed_camera_angle = camera_angle + 180;

    if (reversed_camera_angle >= 360)
        reversed_camera_angle -= 360;
}


function setCameraAngleFromWorldVector(dx, dz) {

    camera_angle = Math.atan2(dx, -dz) * 180 / Math.PI;

    if (camera_angle < 0)
        camera_angle += 360;

    if (camera_angle >= 360)
        camera_angle -= 360;

    reversed_camera_angle = camera_angle + 180;

    if (reversed_camera_angle >= 360)
        reversed_camera_angle -= 360;
}

// Section 8: functions that are called to do the drawing
function DrawCharacters() {

  let how_many_showing = 0;

  for (let character_no = 0; character_no < characters_x.length; character_no++) { 

    if (characters_x[character_no] > x_location - 3000 &&
        characters_x[character_no] < x_location + 3000 &&
        characters_z[character_no] > z_location - 3000 &&
        characters_z[character_no] < z_location + 3000 ) {
  
	  DrawPerson(characters_x[character_no],
                 characters_y[character_no], 
                 characters_z[character_no],
                 characters_texture[character_no]);

    how_many_showing++;
    }
  }
}

function DrawOtherCars() {

  for (var car = 0; car < other_car_positions.length; car++) { 

    DrawModel(
      other_car_positions[car][0],
      10,
      other_car_positions[car][1],
      1,
      directionToAngle(other_car_positions[car][3]),
      0,
      'car'
    );          
  }
}

function directionToAngle(direction) {
    if (direction === "east") return 0;
    if (direction === "south") return 90;
    if (direction === "west") return 180;
    if (direction === "north") return 270;
    return 0;
}

function DisplayFloorSky() {
  movePushMatrix();  
  moveTranslate([0,0,0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, floorVerticesTextureCoordBuffer);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, game_texture[4]);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, seaVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  movePopMatrix();

  movePushMatrix();  
  moveTranslate([0,0,0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, floorVerticesTextureCoordBuffer);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, game_texture[7]);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, skyVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  movePopMatrix();
  
}

function DisplayTrack() {

    movePushMatrix();

    moveTranslate([0, 0, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, trackVerticesTextureCoordBuffer);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, game_texture[6]);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, trackVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trackVerticesIndexBuffer);

    setMatrixUniforms();

    gl.drawElements(
        gl.TRIANGLES,
        trackVertexIndexCount,
        gl.UNSIGNED_SHORT,
        0
    );

    movePopMatrix();

    // Appending the track side buildings, trees, grandstands, wild ...
    movePushMatrix();

    moveTranslate([0, 0, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, trackBuildingVerticesTextureCoordBuffer);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, game_texture[9]);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, trackBuildingVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trackBuildingVerticesIndexBuffer);

    setMatrixUniforms();

    // This will show the crash barriers if enabled
    /*gl.drawElements(
        gl.TRIANGLES,
        trackBuildingVertexIndexCount,
        gl.UNSIGNED_SHORT,
        0
    );*/

    movePopMatrix();
}

function DrawModel(x, y, z, texture, direction, spin, model_type) { 

  movePushMatrix();
  moveTranslate([x, y, z]);

  let texture_buffer = spriteVerticesTextureCoordBuffer;
  let vertices_buffer = spriteVerticesBuffer;
  let index_buffer = spriteVerticesIndexBuffer;

  if (model_type == 'car') {
    texture_buffer = otherCarVerticesTextureCoordBuffer;
    vertices_buffer = buildingVerticesBuffer;
    index_buffer = buildingVerticesIndexBuffer;
    texture = 13;
  }

  moveRotate(direction, [0, 1, 0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, texture_buffer);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, game_texture[texture]);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertices_buffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0);

  movePopMatrix();
}

function DrawPerson(x, y, z, texture) { 

  movePushMatrix();
  moveTranslate([x, y, z]);

  let texture_buffer = spriteVerticesTextureCoordBuffer;
  let vertices_buffer = spriteVerticesBuffer;
  let index_buffer = spriteVerticesIndexBuffer;

  let direction = -camera_angle;

  moveRotate(direction, [0, 1, 0]); // change to face the camera

  gl.bindBuffer(gl.ARRAY_BUFFER, texture_buffer);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, game_texture[texture]);
  gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertices_buffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, 30, gl.UNSIGNED_SHORT, 0);

  movePopMatrix();
}

// Section 9: game logic, such as moving characters around, handling collision detection, updating the stats and the sound

function UpdateStats() {
  document.getElementById("fps").value = fps;
  lap_time++;
}

// Section 10: Matrices - these functions manipulate the matrices that are used to draw things in the 3D world

function multiplyMatrices(a, b) {

  const result = Array(4).fill().map(() => Array(4).fill(0));

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
}

function translateMatrix(vector,current_location_matrix) {

  let new_location_matrix = [[1,0,0,vector[0],],
                             [0,1,0,vector[1],],
                             [0,0,1,vector[2],],
                             [0,0,0,1]];

  return multiplyMatrices(current_location_matrix, new_location_matrix ); 
}

function rotateMatrix(angle, axis, current_location_matrix) {

  // Ensure axis is normalized
  let length = Math.hypot(axis[0], axis[1], axis[2]);
  let x = axis[0] / length;
  let y = axis[1] / length;
  let z = axis[2] / length;

  let c = Math.cos(angle);
  let s = Math.sin(angle);
  let t = 1 - c;

  let rotate_matrix = [
    [t*x*x + c,     t*x*y - z*s,   t*x*z + y*s,   0],
    [t*x*y + z*s,   t*y*y + c,     t*y*z - x*s,   0],
    [t*x*z - y*s,   t*y*z + x*s,   t*z*z + c,     0],
    [0,             0,             0,             1]
  ];

  return multiplyMatrices(current_location_matrix, rotate_matrix );
}

// Many of the GL functions required flattened matrices ( just an array ) and so this is useful for that
function flattenMatrix(multi_dimentional_matrix) {
    let result = [];
    for (let j = 0; j < multi_dimentional_matrix[0].length; j++)
        for (let i = 0; i < multi_dimentional_matrix.length; i++)
            result.push(multi_dimentional_matrix[i][j]);
    return result;
}

function createPerspective(fovy, aspect, znear, zfar) {
    let ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    let ymin = -ymax;
    let xmin = ymin * aspect;
    let xmax = ymax * aspect;
    let X = 2*znear/(xmax-xmin);
    let Y = 2*znear/(ymax-ymin);
    let A = (xmax+xmin)/(xmax-xmin);
    let B = (ymax+ymin)/(ymax-ymin);
    let C = -(zfar+znear)/(zfar-znear);
    let D = -1; 

    let perspective_matrix = flattenMatrix([[X, 0, A, 0],
                              [0, Y, B, 0],
                              [0, 0, C, D],
                              [0, 0, -1, 0]]);

    return perspective_matrix;
}

function loadIdentity() {

  movementMatrix =  [[1,0,0,0,],
                  [0,1,0,0,],
                  [0,0,1,0,],
                  [0,0,0,1]
                 ];
}

function moveTranslate(v) {
  movementMatrix = translateMatrix(v,movementMatrix);
}

function setMatrixUniforms() {
  let mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flattenMatrix(movementMatrix)));
}

function movePushMatrix() {
    let duplicate = movementMatrix;
    matrixStack.push(duplicate);
}

function movePopMatrix() {
  if (!matrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }
  movementMatrix = matrixStack.pop();
}

function moveRotate(angle, v) {

  let inRadians = angle * Math.PI / 180.0;
  movementMatrix = rotateMatrix(inRadians,v,movementMatrix);
}


// Section 11: Buffers - the OpenGL ES ( in essence what WebGL is ) routines need everything in buffers ( we cannot just give them arrays ) and so these functions convert the relavent data into buffers

function generateBuffers(data,data_type) {
  let buffer_object = gl.createBuffer(); 
  
  if (data_type == "ARRAY_BUFFER") {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer_object);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  }
  else {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer_object);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
  }
  return buffer_object;
}

function initBuffers() { 

  trackVerticesBuffer = generateBuffers(trackGeometry.vertices, "ARRAY_BUFFER");
  trackVerticesTextureCoordBuffer = generateBuffers(trackGeometry.textureCoordinates, "ARRAY_BUFFER");
  trackVerticesIndexBuffer = generateBuffers(trackGeometry.indices, "ELEMENT_ARRAY_BUFFER");
  trackVertexIndexCount = trackGeometry.indices.length;
  trackBuildingVerticesBuffer = generateBuffers(trackGeometry.building_vertices, "ARRAY_BUFFER");
  trackBuildingVerticesTextureCoordBuffer = generateBuffers(trackGeometry.building_textureCoordinates, "ARRAY_BUFFER");
  trackBuildingVerticesIndexBuffer = generateBuffers(trackGeometry.building_indices, "ELEMENT_ARRAY_BUFFER");
  trackBuildingVertexIndexCount = trackGeometry.building_indices.length;
  otherCarVerticesTextureCoordBuffer = generateBuffers(other_car_texture_coordinates, "ARRAY_BUFFER");
  spriteVerticesBuffer = generateBuffers(sprite_vertices,"ARRAY_BUFFER");
  buildingVerticesBuffer = generateBuffers(building_vertices,"ARRAY_BUFFER");
  carVerticesBuffer = generateBuffers(car_vertices,"ARRAY_BUFFER");
  spriteVerticesTextureCoordBuffer = generateBuffers(sprite_texture_coordinates,"ARRAY_BUFFER");
  buildingVerticesTextureCoordBuffer = generateBuffers(building_texture_coordinates,"ARRAY_BUFFER");
 
  carVerticesTextureCoordBuffer = generateBuffers(car_texture_coordinates,"ARRAY_BUFFER");
  spriteVerticesIndexBuffer = generateBuffers(sprite_vertex_indices,"ELEMENT_ARRAY_BUFFER");
  buildingVerticesIndexBuffer = generateBuffers(building_vertex_indices,"ELEMENT_ARRAY_BUFFER");
  floorVerticesBuffer = generateBuffers(floor_vertices,"ARRAY_BUFFER"); 
  skyVerticesBuffer = generateBuffers(sky_vertices,"ARRAY_BUFFER"); 
  seaVerticesBuffer = generateBuffers(sea_vertices,"ARRAY_BUFFER");
  floorVerticesTextureCoordBuffer = generateBuffers(floor_texture_coordinates,"ARRAY_BUFFER");
  floorVerticesIndexBuffer = generateBuffers(floor_vertex_indices,"ELEMENT_ARRAY_BUFFER");
}

// Section 12: texture handler - we want to wrap the models in our game with textures. This code converts the image data into the textures

function PrepareGameTextures(image_to_use, texture_image_number) {

  game_texture[texture_image_number] = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, game_texture[texture_image_number]);

  // temporary 1x1 pixel while image loads
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 0, 0, 255])
  );

  game_image[texture_image_number] = new Image();

  game_image[texture_image_number].onload = function() {
    handleTextureLoaded(
      game_image[texture_image_number],
      game_texture[texture_image_number]
    );
  };

  game_image[texture_image_number].src = image_to_use;
}

function initTextures() {
  PrepareGameTextures(character_image[0],0);
  PrepareGameTextures(character_image[1],1);
  PrepareGameTextures(character_image[2],2);
  PrepareGameTextures(character_image[3],3);
  PrepareGameTextures(sea_texture_image,4);
  PrepareGameTextures(cube_texture_image,5);
  PrepareGameTextures(floor_texture_image,6);
  PrepareGameTextures(sky_texture_image,7);
  PrepareGameTextures(bonnet_texture_image,8);
  PrepareGameTextures(building_image[0],9);
  PrepareGameTextures(building_image[1],10);
  PrepareGameTextures(building_image[2],11);
  PrepareGameTextures(building_image[3],12);
  PrepareGameTextures(car_image[0],13);
  PrepareGameTextures(car_image[1],14);
  PrepareGameTextures(car_image[2],15);
  PrepareGameTextures(car_image[3],16);
}

function handleTextureLoaded(image, texture) {

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    image
  );

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // sharper than LINEAR for pixel/track tiles
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  gl.bindTexture(gl.TEXTURE_2D, null);
}

// Section 13: WebGL - initiate and prepare to start drawing
function initWebGL() {

//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//

  gl = null;
  
  try {   

    gl = canvas.getContext("webgl2", {
      alpha: false,  // true could potentially slow down some browsers
      antialias: true, // true can cause flicker on some browsers
      preserveDrawingBuffer: false, // true is expensive and might hurt browser performance
      premultipliedAlpha: true,
      desynchronized: true, // hint; Safari may ignore
    });

  }
  catch(e) {
  }
  
  // If we don't have a GL context, give up now
  
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }
}

// Section 14: Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
  let shaderScript = document.getElementById(id);
  
  // Didn't find an element with the specified ID; abort.
  
  if (!shaderScript) {
    return null;
  }
  
  // Walk through the source elements building the shader source string.
  
  let theSource = "";
  let currentChild = shaderScript.firstChild;
  
  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }
    
    currentChild = currentChild.nextSibling;
  }
  
  // Now figure out what type of shader script we have based on its MIME type.
  
  let shader;
  
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }
  
  // Send the source to the shader object
  
  gl.shaderSource(shader, theSource);
  
  // Compile the shader program
  
  gl.compileShader(shader);
  
  // See if it compiled successfully
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }
  
  return shader;
}

// Initialize the shaders, so WebGL knows how to light our scene.
function initShaders() {
  let fragmentShader = getShader(gl, "shader-fs");
  let vertexShader = getShader(gl, "shader-vs");
  
  // Create the shader program
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  
  // If creating the shader program failed, alert
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program.");
  }
  
  gl.useProgram(shaderProgram);
  
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
  
  textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(textureCoordAttribute);
}

