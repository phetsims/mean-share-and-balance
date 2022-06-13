// Copyright 2022, University of Colorado Boulder

/**
 * Draws individual curved arrow for Sync Icon
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import { Shape } from '../../../../kite/js/imports.js';
import meanShareAndBalance from '../../meanShareAndBalance.js';

export default class SyncArrowShape extends Shape {

  // REVIEW: Please add documentation for the parameters, including but not limited to units.
  public constructor( radius: number, orientation: number ) {
    super();
    const innerRadius = radius * 0.4;
    const outerRadius = radius * 0.6;
    const headWidth = 2.25 * ( outerRadius - innerRadius );
    const startAngle = Math.PI * orientation;
    const endToNeckAngularSpan = -2 * Math.PI * 0.32;
    const arrowHeadAngularSpan = -2 * Math.PI * 0.07;

    // Inner edge of end
    this.moveTo( innerRadius * Math.cos( startAngle ), innerRadius * Math.sin( startAngle ) );
    this.lineTo( outerRadius * Math.cos( startAngle ), outerRadius * Math.sin( startAngle ) );
    const neckAngle = startAngle + endToNeckAngularSpan;

    // Outer curve
    this.arc( 0, 0, outerRadius, startAngle, neckAngle, true );
    const headWidthExtrusion = ( headWidth - ( outerRadius - innerRadius ) ) / 2;
    this.lineTo(
      ( outerRadius + headWidthExtrusion ) * Math.cos( neckAngle ),
      ( outerRadius + headWidthExtrusion ) * Math.sin( neckAngle )
    );

    //Arrow Head
    const pointRadius = ( outerRadius + innerRadius ) * 0.5;
    this.lineTo(
      pointRadius * Math.cos( neckAngle + arrowHeadAngularSpan ),
      pointRadius * Math.sin( neckAngle + arrowHeadAngularSpan )
    );
    this.lineTo(
      ( innerRadius - headWidthExtrusion ) * Math.cos( neckAngle ),
      ( innerRadius - headWidthExtrusion ) * Math.sin( neckAngle )
    );
    this.lineTo(
      innerRadius * Math.cos( neckAngle ),
      innerRadius * Math.sin( neckAngle )
    );

    // Inner Curve
    this.arc( 0, 0, innerRadius, neckAngle, startAngle );
    this.close();

  }
}

meanShareAndBalance.register( 'SyncArrowShape', SyncArrowShape );