// templates/phoneCoverTemplate.js
export default {
  name: "Phone Cover",
  canvasSize: { width: 250, height: 500 },
  background: "/images/phone-cover-bg.png",
  placeholderImage: "/images/placeholder.png",
  cameraCutout: {
    x: 20,
    y: 20,
    width: 90,
    height: 120,
    radius: 10,
  },
  clipFunc: (ctx, w, h) => {
    const r = 20;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
  },
};
