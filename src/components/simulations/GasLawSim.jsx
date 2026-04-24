import React, { useState, useEffect, useRef } from 'react';

const GasLawSim = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);
  const R = 0.0821; // L·atm/(mol·K)

  const [mol, setMol] = useState(1);
  const [tempC, setTempC] = useState(25);
  const [volume, setVolume] = useState(10); // L
  const tempK = tempC + 273.15;

  // PV = nRT → P = nRT/V
  const pressure = (mol * R * tempK) / volume;

  // Tính tốc độ trung bình phân tử (tỷ lệ với sqrt(T))
  const speed = Math.sqrt(tempK / 300) * 3;

  // Khởi tạo particles
  useEffect(() => {
    const count = Math.min(Math.round(mol * 30), 150);
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: 30 + Math.random() * 240,
        y: 30 + Math.random() * 200,
        vx: (Math.random() - 0.5) * speed * 2,
        vy: (Math.random() - 0.5) * speed * 2,
        r: 4,
      });
    }
    particlesRef.current = particles;
  }, [mol]);

  // Update speed when temp changes
  useEffect(() => {
    particlesRef.current.forEach(p => {
      const angle = Math.atan2(p.vy, p.vx);
      const s = speed * (0.5 + Math.random());
      p.vx = Math.cos(angle) * s;
      p.vy = Math.sin(angle) * s;
    });
  }, [tempC]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Container dimensions scale with volume (10L → full, 2L → small)
    const containerScale = Math.sqrt(volume / 10);

    const animate = () => {
      ctx.clearRect(0, 0, 300, 260);

      const cw = 240 * containerScale;
      const ch = 200 * containerScale;
      const cx = 150 - cw / 2;
      const cy = 130 - ch / 2;

      // Container
      ctx.strokeStyle = '#76c034';
      ctx.lineWidth = 3;
      ctx.strokeRect(cx, cy, cw, ch);

      // Container fill
      ctx.fillStyle = 'rgba(118, 192, 52, 0.03)';
      ctx.fillRect(cx, cy, cw, ch);

      // Particles
      const particles = particlesRef.current;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off container walls
        if (p.x - p.r < cx) { p.x = cx + p.r; p.vx = Math.abs(p.vx); }
        if (p.x + p.r > cx + cw) { p.x = cx + cw - p.r; p.vx = -Math.abs(p.vx); }
        if (p.y - p.r < cy) { p.y = cy + p.r; p.vy = Math.abs(p.vy); }
        if (p.y + p.r > cy + ch) { p.y = cy + ch - p.r; p.vy = -Math.abs(p.vy); }

        // Draw particle
        const hue = Math.min(tempC / 500 * 60, 60);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = tempC < 0 ? `hsl(210, 80%, 60%)` : `hsl(${30 - hue}, 90%, 55%)`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [volume, tempC, mol]);

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="flex justify-center bg-white rounded-2xl p-4 border border-viet-border">
        <canvas ref={canvasRef} width={300} height={260} className="rounded-xl" />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">Số mol khí (n)</label>
            <span className="text-[13px] font-black text-viet-text">{mol.toFixed(1)} mol</span>
          </div>
          <input type="range" min="0.1" max="5" step="0.1" value={mol} onChange={e => setMol(parseFloat(e.target.value))}
            className="w-full h-2 bg-viet-border rounded-full appearance-none cursor-pointer accent-viet-green" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">Nhiệt độ</label>
            <span className="text-[13px] font-black text-viet-text">{tempC}°C ({tempK.toFixed(1)} K)</span>
          </div>
          <input type="range" min="-50" max="500" step="5" value={tempC} onChange={e => setTempC(parseInt(e.target.value))}
            className="w-full h-2 bg-viet-border rounded-full appearance-none cursor-pointer accent-viet-green" />
          <div className="flex justify-between text-[9px] text-[#ccc] font-bold mt-1"><span>-50°C</span><span>500°C</span></div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">Thể tích bình (V)</label>
            <span className="text-[13px] font-black text-viet-text">{volume.toFixed(1)} L</span>
          </div>
          <input type="range" min="1" max="20" step="0.5" value={volume} onChange={e => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-viet-border rounded-full appearance-none cursor-pointer accent-viet-green" />
        </div>
      </div>

      {/* Results */}
      <div className="bg-viet-bg rounded-2xl p-5 space-y-3">
        <h4 className="text-[10px] font-black text-[#b4bac2] uppercase tracking-[2px]">PV = nRT (R = 0,0821 L·atm/mol·K)</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Áp suất (P = nRT/V)</div>
            <div className="text-[20px] font-black text-viet-green">{pressure.toFixed(3)} <span className="text-[10px]">atm</span></div>
          </div>
          <div className="bg-white rounded-xl p-3">
            <div className="text-[9px] font-bold text-viet-text-light uppercase">Áp suất (kPa)</div>
            <div className="text-[20px] font-black text-viet-text">{(pressure * 101.325).toFixed(1)} <span className="text-[10px]">kPa</span></div>
          </div>
        </div>
        <div className="text-[10px] text-viet-text-light mt-2 leading-relaxed">
          💡 Thay đổi nhiệt độ → phân tử chuyển động nhanh/chậm hơn. Thu nhỏ thể tích → áp suất tăng (Boyle). Tăng số mol → nhiều phân tử va chạm hơn.
        </div>
      </div>
    </div>
  );
};

export default GasLawSim;
