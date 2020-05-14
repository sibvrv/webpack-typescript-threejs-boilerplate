import {BoxGeometry, Color, Mesh, MeshPhongMaterial} from 'three';

/**
 * @class Brick
 */
export class Brick extends Mesh {
  /**
   * Brick Constructor
   * @param size
   * @param color
   */
  constructor(size: number | [number, number, number], color: Color) {
    super();

    const [width, height, depth] = Array.isArray(size) ? size : [size, size, size];

    this.geometry = new BoxGeometry(width, height, depth);
    this.material = new MeshPhongMaterial({color});

    this.castShadow = true;
    this.receiveShadow = true;
  }
}
