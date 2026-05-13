export default function Menu() {
  return (
    <div className="bg-[#232323] relative size-full" data-name="Menu">
      <div className="absolute bg-[#d9d9d9] h-[101px] left-0 rounded-br-[50px] top-0 w-[460px]" />
      <div className="absolute bg-[#d9d9d9] h-[50px] left-[41px] rounded-[10px] top-[139px] w-[189px]" />
      <div className="absolute bg-[rgba(255,255,255,0.2)] h-[621px] left-[622px] rounded-[51px] top-[201px] w-[531px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[622px] not-italic text-[24px] text-white top-[160px] whitespace-nowrap">Existentes</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[663px] not-italic text-[24px] text-white top-[271px] whitespace-nowrap">{` base 1`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[823px] not-italic text-[24px] text-white top-[271px] whitespace-pre">{`modifica:  fecha hora`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[663px] not-italic text-[24px] text-white top-[322px] whitespace-nowrap">{` base 1`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[663px] not-italic text-[24px] text-white top-[373px] whitespace-nowrap">{` base 1`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[663px] not-italic text-[24px] text-white top-[424px] whitespace-nowrap">{` base 1`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[663px] not-italic text-[24px] text-white top-[475px] whitespace-nowrap">{` base 1`}</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[34px] not-italic text-[24px] text-black top-[36px] whitespace-nowrap">Bienvenido nombre</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[54px] not-italic text-[24px] text-black top-[152px] whitespace-nowrap">Crea nueva db</p>
    </div>
  );
}