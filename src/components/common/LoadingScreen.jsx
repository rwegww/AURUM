/** Shared route/auth loader; inline mode keeps dashboard navigation available. */
export default function LoadingScreen({ inline = false, label = 'Đang chuẩn bị không gian học tập…' }) {
  return (
    <div className={`aurum-loader ${inline ? 'aurum-loader--inline' : 'aurum-loader--screen'}`}
      role="status" aria-live="polite" aria-busy="true">
      <div className="aurum-loader__content">
        <div className="aurum-loader__emblem" aria-hidden="true">
          <span className="aurum-loader__halo" />
          <span className="aurum-loader__orbit aurum-loader__orbit--outer" />
          <span className="aurum-loader__orbit aurum-loader__orbit--inner" />
          <div className="aurum-loader__logo"><img src="/logo.png" alt="" /></div>
        </div>
        <p className="aurum-loader__eyebrow" aria-hidden="true">KHÁM PHÁ · HIỂU · CHINH PHỤC</p>
        <h2 className="aurum-loader__title">AURUM<span>.</span></h2>
        <p className="aurum-loader__label">{label}</p>
        <div className="aurum-loader__track" aria-hidden="true"><span /></div>
        <div className="aurum-loader__molecules" aria-hidden="true">
          <span>H₂O</span><i /><span>CO₂</span><i /><span>NaCl</span>
        </div>
      </div>
    </div>
  );
}
