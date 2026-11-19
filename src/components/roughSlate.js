// Interactive Touch & Stylus Rough Slate Component
export function initRoughSlate() {
  const modal = document.getElementById("sp-slate-modal");
  const canvas = document.getElementById("sp-slate-canvas");
  if (!modal || !canvas) return;

  const ctx = canvas.getContext("2d");
  let drawing = false;
  let penColor = "#1e293b";

  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = penColor;

  function getCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function startDraw(e) {
    e.preventDefault();
    drawing = true;
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = getCoords(e);
    ctx.strokeStyle = penColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw() {
    drawing = false;
  }

  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", draw);
  window.addEventListener("mouseup", endDraw);

  canvas.addEventListener("touchstart", startDraw, { passive: false });
  canvas.addEventListener("touchmove", draw, { passive: false });
  canvas.addEventListener("touchend", endDraw);

  document.querySelectorAll("[data-pen-color]").forEach((btn) => {
    btn.addEventListener("click", () => {
      penColor = btn.getAttribute("data-pen-color");
    });
  });

  window.SP = window.SP || {};
  window.SP.openRoughSlate = () => { modal.style.display = "flex"; };
  window.SP.closeRoughSlate = () => { modal.style.display = "none"; };
  window.SP.clearRoughSlate = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); };
}
