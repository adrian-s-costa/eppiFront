export default function Pfp({ pfp }: any) {
  return (
    <div
      className={`rounded-full w-[${pfp.width}] h-[${pfp.width}] bg-cover mr-${pfp.mr}`}
      style={{ backgroundImage: `url(${pfp.url})` }}
    ></div>
  );
}
