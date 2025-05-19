import Konva from 'konva';

export const templates = {
  mug: {
    width: 600,
    height: 600,
    clipFunc: (ctx) => {
      // Rounded rect clip area for mug printable zone
      const radius = 50;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(600 - radius, 0);
      ctx.quadraticCurveTo(600, 0, 600, radius);
      ctx.lineTo(600, 600 - radius);
      ctx.quadraticCurveTo(600, 600, 600 - radius, 600);
      ctx.lineTo(radius, 600);
      ctx.quadraticCurveTo(0, 600, 0, 600 - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();
    },
  },

  phoneCover: {
    width: 600,
    height: 1200,
    clipFunc: (ctx) => {
      // Example: Phone shape with camera cutout (simplified)
      ctx.beginPath();
      ctx.moveTo(40, 0);
      ctx.lineTo(560, 0);
      ctx.quadraticCurveTo(600, 0, 600, 40);
      ctx.lineTo(600, 1160);
      ctx.quadraticCurveTo(600, 1200, 560, 1200);
      ctx.lineTo(40, 1200);
      ctx.quadraticCurveTo(0, 1200, 0, 1160);
      ctx.lineTo(0, 40);
      ctx.quadraticCurveTo(0, 0, 40, 0);
      // camera cutout
      ctx.moveTo(300, 50);
      ctx.arc(300, 50, 20, 0, 2 * Math.PI, true);
      ctx.closePath();
      ctx.clip();
    },
  },

  bottle: {
    width: 600,
    height: 800,
    clipFunc: (ctx) => {
      // Ellipse shape mask for bottle printable area
      ctx.beginPath();
      ctx.ellipse(300, 400, 250, 380, 0, 0, 2 * Math.PI);
      ctx.clip();
    },
  },
};
