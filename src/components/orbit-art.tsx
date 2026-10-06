/** 纯 CSS 轨道图形是品牌视觉，不依赖外部图片、Canvas 或第三方请求。 */
export function OrbitArt() {
  return (
    <div
      className="orbit-art relative w-[100%] [aspect-ratio:1] isolate max-[760px]:max-w-[420px] max-[760px]:[margin:15px_auto_0]"
      aria-hidden="true"
    >
      <div className="orbit-grid absolute [inset:10%] rounded-[50%] [background:radial-gradient(#7d91cc48_1px,_transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(circle,_#000_25%,_transparent_69%)]" />
      <div className="orbit-ring absolute [top:26%] [left:4%] w-[94%] h-[49%] [border:1px_solid_#889bd367] rounded-[50%] ring-one [transform:rotate(-32deg)]" />
      <div className="orbit-ring absolute [top:26%] [left:4%] w-[94%] h-[49%] [border:1px_solid_#889bd367] rounded-[50%] ring-two [transform:rotate(32deg)]" />
      <div className="orbit-ring absolute [top:26%] [left:4%] w-[94%] h-[49%] [border:1px_solid_#889bd367] rounded-[50%] ring-three [transform:rotate(90deg)] w-[91%] [left:5%] h-[59%] [top:22%] border-[#a4b2d836]" />
      <div className="orbit-core absolute [inset:24%] rounded-[50%] grid [place-items:center] overflow-hidden [background:radial-gradient(circle_at_30%_25%,_#cbd8ff,_#6586ee_37%,_#284de0_64%,_#203da0_86%)] [box-shadow:inset_-10px_-15px_36px_#15296f55,_inset_4px_5px_25px_#ffffff90,_0_24px_50px_#254ce52b] [&::after]:[content:''] [&::after]:absolute [&::after]:[inset:0] [&::after]:opacity-[0.2] [&::after]:[background:repeating-linear-gradient(0deg,_transparent,_transparent_2px,_#17243c35_3px)] [&_>_span:first-child]:text-[color:#eef2ff] [&_>_span:first-child]:[font-family:Georgia,_serif] [&_>_span:first-child]:text-[clamp(90px,_11vw,_154px)] [&_>_span:first-child]:font-[400] [&_>_span:first-child]:italic [&_>_span:first-child]:tracking-[-14px] [&_>_span:first-child]:[transform:translate(-8px,_-6px)] [&_>_span:first-child]:[text-shadow:0_4px_15px_#1e39a440] max-[760px]:[&_>_span:first-child]:text-[116px]">
        <span>sk</span>
        <span className="core-spark absolute [right:17%] [top:22%] text-[33px] text-[color:#ffffffc4]">
          ✳
        </span>
      </div>
      <span className="satellite absolute w-[13px] h-[13px] rounded-[50%] z-[2] bg-[var(--accent)] [box-shadow:0_0_0_5px_var(--paper)] satellite-one [top:29%] [right:10%]" />
      <span className="satellite absolute w-[13px] h-[13px] rounded-[50%] z-[2] bg-[var(--accent)] [box-shadow:0_0_0_5px_var(--paper)] satellite-two w-[8px] h-[8px] [bottom:29%] [left:11%] bg-[#a0aed4]" />
    </div>
  );
}
