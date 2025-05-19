export function exportCanvasImage(stageRef, fileName = 'design.png') {
  if (!stageRef.current) return;

  const dataURL = stageRef.current.toDataURL({ pixelRatio: 3 });

  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
